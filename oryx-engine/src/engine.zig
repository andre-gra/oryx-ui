//! Root del modulo WASM `oryx-engine`.
//! Compilato con: zig build (wasm32-freestanding, ReleaseSmall).
//! Zero allocazioni: il chiamante JS scrive input nei buffer esposti e legge
//! gli output nella linear memory (zero-copy).

const std = @import("std");
const color = @import("color.zig");
const theme = @import("theme.zig");
const agent = @import("agent.zig");

/// Numero massimo di colori gestibili nella matrice di contrasto.
pub const MAX_COLORS = 128;

// Buffer statici di lavoro (linear memory della wasm).
var input_buf: [MAX_COLORS * 3]u8 = undefined;
var output_buf: [MAX_COLORS * MAX_COLORS]f32 = undefined;
var theme_buf: [theme.RAMP_STEPS * 3]u8 = undefined;

// Buffer dell'agent: interazioni in input, preferenze di lavoro, risultato.
var agent_input_buf: [agent.MAX_INTERACTIONS]agent.Interaction = undefined;
var agent_prefs_buf: [agent.MAX_PREFS]agent.Preference = undefined;
var agent_out_buf: [16]u8 = undefined; // theme_id(0), size_id(1), confidence f64(8)

pub export fn get_input_ptr() [*]u8 {
    return &input_buf;
}

pub export fn get_output_ptr() [*]f32 {
    return &output_buf;
}

pub export fn get_theme_ptr() [*]u8 {
    return &theme_buf;
}

/// Versione dell'engine (utile per il feature-detection).
pub export fn engine_version() u32 {
    return 1;
}

/// Luminanza relativa WCAG di un colore.
pub export fn relative_luminance(r: u8, g: u8, b: u8) f32 {
    return color.relativeLuminance(.{ .r = r, .g = g, .b = b });
}

/// Contrast ratio WCAG tra due colori.
pub export fn contrast(r1: u8, g1: u8, b1: u8, r2: u8, g2: u8, b2: u8) f32 {
    return color.contrastRatio(
        .{ .r = r1, .g = g1, .b = b1 },
        .{ .r = r2, .g = g2, .b = b2 },
    );
}

/// Calcola la matrice di contrasto `count x count` dei colori scritti in
/// input_buf (RGB a 3 byte ciascuno). Il risultato (f32, row-major) finisce in
/// output_buf. Ritorna il numero di elementi scritti.
pub export fn contrast_matrix(count: usize) usize {
    const n = if (count < MAX_COLORS) count else MAX_COLORS;
    for (0..n) |i| {
        const ca = color.Color{
            .r = input_buf[i * 3],
            .g = input_buf[i * 3 + 1],
            .b = input_buf[i * 3 + 2],
        };
        for (0..n) |j| {
            const cb = color.Color{
                .r = input_buf[j * 3],
                .g = input_buf[j * 3 + 1],
                .b = input_buf[j * 3 + 2],
            };
            output_buf[i * n + j] = color.contrastRatio(ca, cb);
        }
    }
    return n * n;
}

/// Genera una rampa di 12 step dal colore seed (r,g,b) in modalità light/dark.
/// Il risultato (RGB a 3 byte per step) finisce in theme_buf. Ritorna 12.
pub export fn theme_from_seed(r: u8, g: u8, b: u8, dark: u8) usize {
    const ramp = theme.themeFromSeed(.{ .r = r, .g = g, .b = b }, dark != 0);
    for (ramp, 0..) |c, i| {
        theme_buf[i * 3] = c.r;
        theme_buf[i * 3 + 1] = c.g;
        theme_buf[i * 3 + 2] = c.b;
    }
    return ramp.len;
}

/// Verifica accessibilità del tema generato (sfondo step1 / testo step9).
pub export fn theme_a11y(r: u8, g: u8, b: u8, dark: u8, out: [*]f32) usize {
    const info = theme.themeA11y(.{ .r = r, .g = g, .b = b }, dark != 0);
    out[0] = info.ratio;
    out[1] = @floatFromInt(info.bg.r);
    out[2] = @floatFromInt(info.bg.g);
    out[3] = @floatFromInt(info.bg.b);
    out[4] = @floatFromInt(info.fg.r);
    out[5] = @floatFromInt(info.fg.g);
    out[6] = @floatFromInt(info.fg.b);
    out[7] = if (info.pass_aa_text) 1.0 else 0.0;
    return 8;
}

/// Puntatore al buffer delle interazioni (agent_input_buf). Il chiamante JS
/// scrive qui le interazioni (array di Interaction a 24 byte l'una).
pub export fn get_agent_input_ptr() [*]u8 {
    return @ptrCast(&agent_input_buf);
}

/// Puntatore al buffer di output della raccomandazione:
/// byte 0 = theme_id, byte 1 = size_id, byte 8..16 = confidence (f64).
pub export fn get_agent_output_ptr() [*]u8 {
    return &agent_out_buf;
}

/// Esegue la raccomandazione dell'agent su `count` interazioni (lette da
/// agent_input_buf). Ritorna 1 se trovata una raccomandazione, 0 altrimenti.
pub export fn agent_recommend(count: usize, current_hour: u8, current_day: u8, now_ms: f64) u32 {
    const n = if (count < agent.MAX_INTERACTIONS) count else agent.MAX_INTERACTIONS;
    const rec = agent.recommend(agent_input_buf[0..n], agent_prefs_buf[0..], current_hour, current_day, now_ms);
    agent_out_buf[0] = rec.theme_id;
    agent_out_buf[1] = rec.size_id;
    agent_out_buf[8..16].* = std.mem.toBytes(@as(f64, rec.confidence));
    return if (rec.found) 1 else 0;
}
