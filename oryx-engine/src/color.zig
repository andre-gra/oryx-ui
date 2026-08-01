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
