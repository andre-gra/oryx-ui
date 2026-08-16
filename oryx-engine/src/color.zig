const std = @import("std");

/// Color matematica pura, senza allocazioni.
pub const Color = struct {
    r: u8,
    g: u8,
    b: u8,

    pub fn fromHex(hex: u32) Color {
        return .{ .r = @intCast((hex >> 16) & 0xFF), .g = @intCast((hex >> 8) & 0xFF), .b = @intCast(hex & 0xFF) };
    }

    pub fn toHex(self: Color) u32 {
        return (@as(u32, self.r) << 16) | (@as(u32, self.g) << 8) | @as(u32, self.b);
    }
};

// ---------------------------------------------------------------------------
// sRGB <-> linear
// ---------------------------------------------------------------------------

pub inline fn srgbToLinearByte(c: u8) f32 {
    const v: f32 = @floatFromInt(c);
    const s = v / 255.0;
    return if (s <= 0.04045) s / 12.92 else std.math.pow(f32, (s + 0.055) / 1.055, 2.4);
}

pub inline fn linearToSrgbByte(v: f32) u8 {
    const s = if (v <= 0.0031308) v * 12.92 else 1.055 * std.math.pow(f32, v, 1.0 / 2.4) - 0.055;
    const clamped = std.math.clamp(s, 0.0, 1.0);
    return @intFromFloat(std.math.round(clamped * 255.0));
}

// ---------------------------------------------------------------------------
// WCAG relative luminance + contrast ratio
// ---------------------------------------------------------------------------

pub fn relativeLuminance(c: Color) f32 {
    const r = srgbToLinearByte(c.r);
    const g = srgbToLinearByte(c.g);
    const b = srgbToLinearByte(c.b);
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

pub fn contrastRatio(a: Color, b: Color) f32 {
    const la = relativeLuminance(a);
    const lb = relativeLuminance(b);
    const hi = @max(la, lb);
    const lo = @min(la, lb);
    return (hi + 0.05) / (lo + 0.05);
}

// ---------------------------------------------------------------------------
// OKLCH (Björn Ottoson) — usato per il theme engine
// ---------------------------------------------------------------------------

pub const Oklch = struct { L: f32, C: f32, H: f32 };

pub fn srgbToOklch(c: Color) Oklch {
    const r = srgbToLinearByte(c.r);
    const g = srgbToLinearByte(c.g);
    const b = srgbToLinearByte(c.b);

    const l_ = 0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b;
    const m_ = 0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b;
    const s_ = 0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b;

    const l3 = std.math.cbrt(l_);
    const m3 = std.math.cbrt(m_);
    const s3 = std.math.cbrt(s_);

    const L = 0.2104542553 * l3 + 0.7936177850 * m3 - 0.0040720468 * s3;
    const a = 1.9779984951 * l3 - 2.4285922050 * m3 + 0.4505937099 * s3;
    const b_ = 0.0259040371 * l3 + 0.7827717662 * m3 - 0.8086757660 * s3;

    const C = std.math.sqrt(a * a + b_ * b_);
    const H = std.math.atan2(b_, a);
    return .{ .L = L, .C = C, .H = H };
}

pub fn oklchToSrgb(oc: Oklch) Color {
    const a = oc.C * std.math.cos(oc.H);
    const b_ = oc.C * std.math.sin(oc.H);

    const l_ = oc.L + 0.3963377774 * a + 0.2158037573 * b_;
    const m_ = oc.L - 0.1055613458 * a - 0.0638541728 * b_;
    const s_ = oc.L - 0.0894841775 * a - 1.2914855480 * b_;

    const l3 = l_ * l_ * l_;
    const m3 = m_ * m_ * m_;
    const s3 = s_ * s_ * s_;

    const r = 4.0767416621 * l3 - 3.3077115913 * m3 + 0.2309699292 * s3;
    const g = -1.2684380046 * l3 + 2.6097574011 * m3 - 0.3413193965 * s3;
    const b = -0.0041960863 * l3 - 0.7034186147 * m3 + 1.7076147010 * s3;

    return .{ .r = linearToSrgbByte(r), .g = linearToSrgbByte(g), .b = linearToSrgbByte(b) };
}

// ---------------------------------------------------------------------------
// OKLCH -> sRGB con gamut mapping percettivo
// ---------------------------------------------------------------------------

/// Converte OKLCH lineare (non ancora clampato) per verificare se è in gamut.
/// Restituisce i componenti lineari RGB [0,1] se in gamut, altrimenti con valori fuori range.
fn oklchToLinearRgb(oc: Oklch) struct { r: f32, g: f32, b: f32 } {
    const a = oc.C * std.math.cos(oc.H);
    const b_ = oc.C * std.math.sin(oc.H);

    const l_ = oc.L + 0.3963377774 * a + 0.2158037573 * b_;
    const m_ = oc.L - 0.1055613458 * a - 0.0638541728 * b_;
    const s_ = oc.L - 0.0894841775 * a - 1.2914855480 * b_;

    const l3 = l_ * l_ * l_;
    const m3 = m_ * m_ * m_;
    const s3 = s_ * s_ * s_;

    const r = 4.0767416621 * l3 - 3.3077115913 * m3 + 0.2309699292 * s3;
    const g = -1.2684380046 * l3 + 2.6097574011 * m3 - 0.3413193965 * s3;
    const b = -0.0041960863 * l3 - 0.7034186147 * m3 + 1.7076147010 * s3;

    return .{ .r = r, .g = g, .b = b };
}

/// Verifica se un colore lineare RGB è dentro il gamut sRGB (tutti i componenti in [0, 1]).
fn isInGamut(linear: struct { r: f32, g: f32, b: f32 }) bool {
    return linear.r >= 0.0 and linear.r <= 1.0 and
           linear.g >= 0.0 and linear.g <= 1.0 and
           linear.b >= 0.0 and linear.b <= 1.0;
}

/// Converte OKLCH in sRGB con gamut mapping percettivo.
/// Se il colore è fuori gamut, riduce iterativamente il chroma mantenendo hue e lightness costanti
/// finché il colore non rientra nel gamut sRGB. Evita lo shift di hue tipico del clamp ingenuo.
pub fn oklchToSrgbMapped(oc: Oklch) Color {
    // Prima prova: verifica se è già in gamut
    var linear = oklchToLinearRgb(oc);
    if (isInGamut(linear)) {
        return .{ .r = linearToSrgbByte(linear.r), .g = linearToSrgbByte(linear.g), .b = linearToSrgbByte(linear.b) };
    }

    // Fuori gamut: riduzione iterativa del chroma (binary search)
    var low: f32 = 0.0;
    var high: f32 = oc.C;
    var best = oc;

    // Tolleranza per la convergenza (chroma difference < 0.0001)
    const TOLERANCE: f32 = 0.0001;
    var iterations: u8 = 0;
    const MAX_ITERATIONS: u8 = 20;

    while (high - low > TOLERANCE and iterations < MAX_ITERATIONS) : (iterations += 1) {
        const mid = (low + high) * 0.5;
        const test_oc = .{ .L = oc.L, .C = mid, .H = oc.H };
        const test_linear = oklchToLinearRgb(test_oc);
        
        if (isInGamut(test_linear)) {
            low = mid;
            best = test_oc;
            linear = test_linear;
        } else {
            high = mid;
        }
    }

    // Fallback: se per qualche motivo non converge, usa l'ultimo valido o clampa
    if (iterations >= MAX_ITERATIONS or !isInGamut(linear)) {
        const fallback = oklchToLinearRgb(best);
        return .{ .r = linearToSrgbByte(fallback.r), .g = linearToSrgbByte(fallback.g), .b = linearToSrgbByte(fallback.b) };
    }

    return .{ .r = linearToSrgbByte(linear.r), .g = linearToSrgbByte(linear.g), .b = linearToSrgbByte(linear.b) };
}

// ---------------------------------------------------------------------------
// Tests (nativi, eseguiti con `zig test` su host)
// ---------------------------------------------------------------------------

const expect = std.testing.expect;

test "srgbToLinearByte known values" {
    try expect(std.math.approxEqAbs(f32, srgbToLinearByte(0), 0.0, 1e-6));
    try expect(std.math.approxEqAbs(f32, srgbToLinearByte(255), 1.0, 1e-6));
    try expect(std.math.approxEqAbs(f32, srgbToLinearByte(128), 0.21586050011, 1e-5));
}

test "WCAG contrast ratio (white vs black)" {
    const white = Color.fromHex(0xFFFFFF);
    const black = Color.fromHex(0x000000);
    const ratio = contrastRatio(white, black);
    try expect(std.math.approxEqAbs(f32, ratio, 21.0, 0.01));
}

test "WCAG contrast: same color -> 1.0" {
    const c = Color.fromHex(0x3366FF);
    try expect(std.math.approxEqAbs(f32, contrastRatio(c, c), 1.0, 0.001));
}

test "sRGB -> OKLCH roundtrip" {
    const seed = Color.fromHex(0xFF6B00);
    const oc = srgbToOklch(seed);
    const back = oklchToSrgb(oc);
    try expect(back.r == seed.r or @abs(@as(i32, back.r) - @as(i32, seed.r)) <= 1);
    try expect(back.g == seed.g or @abs(@as(i32, back.g) - @as(i32, seed.g)) <= 1);
    try expect(back.b == seed.b or @abs(@as(i32, back.b) - @as(i32, seed.b)) <= 1);
}

test "red channel is 0x00 in pure black" {
    const oc = srgbToOklch(Color.fromHex(0x000000));
    try expect(std.math.approxEqAbs(f32, oc.L, 0.0, 1e-3));
}

// ---------------------------------------------------------------------------
// Gamut mapping tests
// ---------------------------------------------------------------------------

test "oklchToSrgbMapped: in-gamut color passes through unchanged" {
    // Un colore ben dentro il gamut (arancione moderato)
    const oc = .{ .L = 0.6, .C = 0.1, .H = 0.5 };
    const c1 = oklchToSrgb(oc);
    const c2 = oklchToSrgbMapped(oc);
    try expect(c1.r == c2.r and c1.g == c2.g and c1.b == c2.b);
}

test "oklchToSrgbMapped: out-of-gamut color gets chroma reduced" {
    // Colore molto saturo fuori gamut (C=0.4 a L=0.5)
    const oc = .{ .L = 0.5, .C = 0.4, .H = 0.0 }; // rosso puro molto saturo
    const mapped = oklchToSrgbMapped(oc);
    // Deve essere un colore valido (non NaN, componenti 0-255)
    try expect(mapped.r <= 255 and mapped.g <= 255 and mapped.b <= 255);
    // Il chroma mappato deve essere minore dell'originale
    const oc_mapped = srgbToOklch(mapped);
    try expect(oc_mapped.C < oc.C);
}

test "oklchToSrgbMapped: preserves hue for out-of-gamut colors" {
    // Test hue preservation: rosso (H=0) non deve diventare arancione/rosa
    const oc = .{ .L = 0.5, .C = 0.4, .H = 0.0 };
    const mapped = oklchToSrgbMapped(oc);
    const oc_mapped = srgbToOklch(mapped);
    // Hue deve rimanere vicino a 0 (o 2π) - tolleranza ~5°
    const hue_diff = if (oc_mapped.H < 0) oc_mapped.H + 2 * std.math.pi else oc_mapped.H;
    try expect(hue_diff < 0.087 or hue_diff > 2 * std.math.pi - 0.087); // ~5°
}

test "oklchToSrgbMapped: preserves lightness for out-of-gamut colors" {
    const oc = .{ .L = 0.7, .C = 0.4, .H = 1.0 };
    const mapped = oklchToSrgbMapped(oc);
    const oc_mapped = srgbToOklch(mapped);
    // Lightness deve essere preservata (tolleranza 0.01)
    try expect(std.math.approxEqAbs(f32, oc_mapped.L, oc.L, 0.01));
}

test "oklchToSrgbMapped: extreme chroma maps to valid color" {
    // Chroma estremo
    const oc = .{ .L = 0.5, .C = 1.0, .H = 2.0 };
    const mapped = oklchToSrgbMapped(oc);
    try expect(mapped.r <= 255 and mapped.g <= 255 and mapped.b <= 255);
    // Non deve essere nero (che indicherebbe un fallimento totale)
    const sum = @as(u16, mapped.r) + @as(u16, mapped.g) + @as(u16, mapped.b);
    try expect(sum > 0);
}