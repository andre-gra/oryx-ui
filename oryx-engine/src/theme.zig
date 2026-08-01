const std = @import("std");
const color = @import("color.zig");

/// Genera una rampa di 12 step (stile Radix Colors) a partire da un colore seed.
/// La tonalità resta quella del brand; lightness e chroma seguono curve dedicate
/// per light/dark. Il risultato è deterministico: stesso seed -> stesso tema.

pub const RAMP_STEPS = 12;

// Lightness target per step, derivate approssimativamente dalle curve Radix.
const L_LIGHT = [_]f32{
    0.992, 0.990, 0.982, 0.962, 0.930, 0.897, 0.858, 0.804, 0.688, 0.604, 0.490, 0.360,
};
const L_DARK = [_]f32{
    0.022, 0.038, 0.056, 0.084, 0.112, 0.146, 0.180, 0.222, 0.290, 0.360, 0.450, 0.570,
};

// Chroma di base per step (light/dark). Scala relativa al seed.
const C_LIGHT = [_]f32{
    0.020, 0.030, 0.055, 0.075, 0.095, 0.115, 0.130, 0.140, 0.125, 0.110, 0.095, 0.080,
};
const C_DARK = [_]f32{
    0.005, 0.008, 0.012, 0.017, 0.023, 0.030, 0.040, 0.055, 0.070, 0.075, 0.070, 0.060,
};

/// Chroma "di riferimento" di un tipico tema accent (es. Radix amber ~0.13).
const REF_CHROMA: f32 = 0.13;
/// Chroma massimo che resta dentro il gamut sRGB alle lightness usate.
const MAX_CHROMA: f32 = 0.30;

pub fn themeFromSeed(seed: color.Color, dark: bool) [RAMP_STEPS]color.Color {
    const oc = color.srgbToOklch(seed);
    const scale = std.math.clamp(oc.C / REF_CHROMA, 0.15, 2.0);

    var out: [RAMP_STEPS]color.Color = undefined;
    for (0..RAMP_STEPS) |i| {
        const L = if (dark) L_DARK[i] else L_LIGHT[i];
        const base_c = if (dark) C_DARK[i] else C_LIGHT[i];
        const C = std.math.clamp(base_c * scale, 0.0, MAX_CHROMA);
        out[i] = color.oklchToSrgb(.{ .L = L, .C = C, .H = oc.H });
    }
    return out;
}

/// Contrasto tra lo step di testo (step 9) e lo sfondo (step 1).
/// Restituisce anche i due colori usati per il calcolo.
pub const ThemeA11y = struct { ratio: f32, pass_aa_text: bool, bg: color.Color, fg: color.Color };

pub fn themeA11y(seed: color.Color, dark: bool) ThemeA11y {
    const ramp = themeFromSeed(seed, dark);
    const bg = ramp[0];
    const fg = ramp[11]; // step 12: colore del testo primario
    const ratio = color.contrastRatio(bg, fg);
    // WCAG AA per testo normale richiede >= 4.5
    return .{ .ratio = ratio, .pass_aa_text = ratio >= 4.5, .bg = bg, .fg = fg };
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

const expect = std.testing.expect;

test "themeFromSeed light produce 12 colors" {
    const ramp = themeFromSeed(.{ .r = 0xFF, .g = 0x6B, .b = 0x00 }, false);
    try expect(ramp.len == 12);
}

test "light mode: step1 is near-white, step12 is dark" {
    const ramp = themeFromSeed(.{ .r = 0xFF, .g = 0x6B, .b = 0x00 }, false);
    try expect(ramp[0].r >= 220 and ramp[0].g >= 220 and ramp[0].b >= 220);
    try expect(ramp[11].r <= 120 and ramp[11].g <= 110 and ramp[11].b <= 110);
}

test "dark mode: step1 near-black, step12 much brighter" {
    const ramp = themeFromSeed(.{ .r = 0xFF, .g = 0x6B, .b = 0x00 }, true);
    const s1 = ramp[0];
    try expect(s1.r <= 30 and s1.g <= 30 and s1.b <= 30);
    const sum1 = @as(u16, s1.r) + @as(u16, s1.g) + @as(u16, s1.b);
    const sum12 = @as(u16, ramp[11].r) + @as(u16, ramp[11].g) + @as(u16, ramp[11].b);
    try expect(sum12 > sum1 + 200);
}

test "determinism: same seed twice -> identical ramp" {
    const seed = color.Color{ .r = 0x33, .g = 0x99, .b = 0xEE };
    const a = themeFromSeed(seed, false);
    const b = themeFromSeed(seed, false);
    for (0..RAMP_STEPS) |i| {
        try expect(a[i].r == b[i].r and a[i].g == b[i].g and a[i].b == b[i].b);
    }
}

test "seed hue is preserved in every chromatic step" {
    const seed = color.Color.fromHex(0xFF6B00);
    const oc_seed = color.srgbToOklch(seed);
    const ramp = themeFromSeed(seed, false);
    for (ramp) |c| {
        const oc = color.srgbToOklch(c);
        // Passi quasi neutri (quasi bianco/nero) hanno chroma < 0.08: la hue è
        // percettivamente invisibile e il gamut-clipping la rende instabile.
        if (oc.C < 0.08) continue;
        const d = @abs(oc.H - oc_seed.H);
        // Tolleranza ~20°: il gamut-clipping sposta leggermente la hue sui passi
        // più saturi (comportamento noto e accettato del gamut mapping).
        try expect(d < 0.35 or (d > 2 * std.math.pi - 0.35));
    }
}
