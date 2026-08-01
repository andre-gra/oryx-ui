//! Scoring dell'agent di theming (porting di ThemeAgent da themeAgent.ts).
//!
//! Aggrega le interazioni utente in preferenze (tema+size), calcola lo score e
//! produce la raccomandazione migliore (tema+size+confidence) dato il contesto
//! temporale corrente. Logica identica al riferimento JS in src/engine/agent.ts
//! (entrambi f64, deterministici).

const std = @import("std");

/// Interazioni minime prima di produrre una raccomandazione (MIN_INTERACTIONS).
pub const MIN_INTERACTIONS = 5;

/// Cap sul numero di interazioni accettate in input (il tracker JS conserva
/// al massimo 1000 interazioni).
pub const MAX_INTERACTIONS = 1024;

/// Cap sul numero di preferenze distinte (40 temi x 3 size = 120).
pub const MAX_PREFS = 128;

const DAY_MS: f64 = 24.0 * 60.0 * 60.0 * 1000.0;
const DURATION_NORM_MS: f64 = 30.0 * 60.0 * 1000.0;

/// Una singola interazione utente (formato piatto per il confine WASM).
/// Layout esterno stabile: 4 byte + f64 + f64 (stride 24).
pub const Interaction = extern struct {
    theme_id: u8,
    size_id: u8,
    day_of_week: u8, // 0-6 (domenica-sabato)
    hour_of_day: u8, // 0-23
    timestamp_ms: f64,
    duration_ms: f64,
};

/// Fascia oraria (come le chiavi di timePatterns in TS).
pub const Slot = enum(u2) { morning, afternoon, evening, night };

pub fn slotForHour(hour: u8) Slot {
    return switch (hour) {
        6...11 => .morning,
        12...17 => .afternoon,
        18...23 => .evening,
        else => .night,
    };
}

/// Contatori per fascia oraria di una preferenza.
pub const TimePatterns = struct {
    morning: u32 = 0,
    afternoon: u32 = 0,
    evening: u32 = 0,
    night: u32 = 0,
};

pub fn timePatternAt(tp: *const TimePatterns, slot: Slot) u32 {
    return switch (slot) {
        .morning => tp.morning,
        .afternoon => tp.afternoon,
        .evening => tp.evening,
        .night => tp.night,
    };
}

pub fn timePatternAdd(tp: *TimePatterns, slot: Slot) void {
    switch (slot) {
        .morning => tp.morning += 1,
        .afternoon => tp.afternoon += 1,
        .evening => tp.evening += 1,
        .night => tp.night += 1,
    }
}

pub fn timePatternTotal(tp: *const TimePatterns) u32 {
    return tp.morning + tp.afternoon + tp.evening + tp.night;
}

/// Preferenza aggregata per una coppia (theme, size).
pub const Preference = struct {
    theme_id: u8 = 0,
    size_id: u8 = 0,
    usage_count: u32 = 0,
    total_duration: f64 = 0,
    last_used: f64 = 0,
    score: f64 = 0,
    time_patterns: TimePatterns = .{},
    day_patterns: [7]u32 = [_]u32{0} ** 7,
};

/// Score di una preferenza (stesso algoritmo di calculateScore in TS).
pub fn calculateScore(pref: *const Preference, total_interactions: u32) f64 {
    const usage_ratio = @as(f64, @floatFromInt(pref.usage_count)) / @as(f64, @floatFromInt(total_interactions));
    const avg_duration = pref.total_duration / @as(f64, @floatFromInt(pref.usage_count));
    const norm = avg_duration / DURATION_NORM_MS;
    const duration_score = if (norm > 1.0) 1.0 else norm;
    return usage_ratio * 0.7 + duration_score * 0.3;
}

/// Boost basato sulla fascia oraria corrente (stesso algoritmo di getTimeBoost).
pub fn getTimeBoost(pref: *const Preference, current_hour: u8) f64 {
    const total = timePatternTotal(&pref.time_patterns);
    if (total == 0) return 0;
    const count = timePatternAt(&pref.time_patterns, slotForHour(current_hour));
    return @as(f64, @floatFromInt(count)) / @as(f64, @floatFromInt(total));
}

/// Aggrega le interazioni in preferenze e calcola gli score.
/// `prefs` deve avere capacity MAX_PREFS; ritorna il numero di preferenze.
pub fn buildPreferences(interactions: []const Interaction, prefs: []Preference) usize {
    var count: usize = 0;
    const total: u32 = @intCast(interactions.len);

    for (interactions) |it| {
        var found: ?usize = null;
        for (prefs[0..count], 0..) |p, i| {
            if (p.theme_id == it.theme_id and p.size_id == it.size_id) {
                found = i;
                break;
            }
        }

        if (found) |i| {
            const p = &prefs[i];
            p.usage_count += 1;
            p.total_duration += it.duration_ms;
            if (it.timestamp_ms > p.last_used) p.last_used = it.timestamp_ms;
            timePatternAdd(&p.time_patterns, slotForHour(it.hour_of_day));
            p.day_patterns[@intCast(it.day_of_week)] += 1;
        } else {
            const p = &prefs[count];
            count += 1;
            p.* = .{
                .theme_id = it.theme_id,
                .size_id = it.size_id,
                .usage_count = 1,
                .total_duration = it.duration_ms,
                .last_used = it.timestamp_ms,
                .time_patterns = .{},
                .day_patterns = [_]u32{0} ** 7,
            };
            timePatternAdd(&p.time_patterns, slotForHour(it.hour_of_day));
            p.day_patterns[@intCast(it.day_of_week)] += 1;
        }
    }

    for (prefs[0..count]) |*p| {
        p.score = calculateScore(p, total);
    }

    return count;
}

/// Esito della raccomandazione.
pub const Recommendation = struct {
    theme_id: u8,
    size_id: u8,
    confidence: f64,
    found: bool,
};

/// Raccomandazione basata sulle preferenze apprese (stesso algoritmo di
/// getRecommendation in TS). found=false se le interazioni sono < MIN o se
/// nessuna preferenza supera score 0.
pub fn recommend(
    interactions: []const Interaction,
    prefs_buf: []Preference,
    current_hour: u8,
    current_day: u8,
    now_ms: f64,
) Recommendation {
    const none = Recommendation{ .theme_id = 0, .size_id = 0, .confidence = 0, .found = false };
    if (interactions.len < MIN_INTERACTIONS) return none;

    const count = buildPreferences(interactions, prefs_buf);
    const day: usize = @intCast(current_day % 7);

    var best_score: f64 = 0;
    var best: ?usize = null;

    for (prefs_buf[0..count], 0..) |p, i| {
        var score = p.score;

        // Boost fascia oraria
        const time_boost = getTimeBoost(&p, current_hour);
        score *= 1 + time_boost;

        // Boost giorno della settimana
        var day_max: u32 = 1;
        for (p.day_patterns) |d| day_max = @max(day_max, d);
        const day_boost = @as(f64, @floatFromInt(p.day_patterns[day])) / @as(f64, @floatFromInt(day_max));
        score *= 1 + day_boost * 0.3;

        // Boost di recenza
        const days_since_use = (now_ms - p.last_used) / DAY_MS;
        const rec = 1 - days_since_use / 30.0;
        const recency_boost = if (rec > 0.0) rec else 0.0;
        score *= 1 + recency_boost * 0.2;

        if (score > best_score) {
            best_score = score;
            best = i;
        }
    }

    const idx = best orelse return none;
    const bp = &prefs_buf[idx];
    const total = @as(f64, @floatFromInt(interactions.len));
    const raw = (@as(f64, @floatFromInt(bp.usage_count)) / total) * (total / 20.0);
    const confidence = if (raw > 1.0) 1.0 else raw;

    return .{
        .theme_id = bp.theme_id,
        .size_id = bp.size_id,
        .confidence = confidence,
        .found = true,
    };
}

// ---------------------------------------------------------------------------
// Test nativi (host)
// ---------------------------------------------------------------------------

test "slotForHour mappa le fasce orarie" {
    try std.testing.expectEqual(Slot.morning, slotForHour(6));
    try std.testing.expectEqual(Slot.morning, slotForHour(11));
    try std.testing.expectEqual(Slot.afternoon, slotForHour(12));
    try std.testing.expectEqual(Slot.afternoon, slotForHour(17));
    try std.testing.expectEqual(Slot.evening, slotForHour(18));
    try std.testing.expectEqual(Slot.evening, slotForHour(23));
    try std.testing.expectEqual(Slot.night, slotForHour(0));
    try std.testing.expectEqual(Slot.night, slotForHour(5));
}

test "calculateScore pesa usage e durata" {
    // usageCount=5 su 10, avgDuration = 1.8M/5 = 360_000 ms -> durationScore = 0.2
    var p = Preference{ .usage_count = 5, .total_duration = 30.0 * 60.0 * 1000.0 };
    const s = calculateScore(&p, 10);
    try std.testing.expectApproxEqAbs(@as(f64, 0.5 * 0.7 + 0.2 * 0.3), s, 0.000001);

    // durata 0 -> durationScore 0
    var p0 = Preference{ .usage_count = 5, .total_duration = 0 };
    const s0 = calculateScore(&p0, 10);
    try std.testing.expectApproxEqAbs(@as(f64, 0.5 * 0.7), s0, 0.000001);

    // durata media di 30 min -> durationScore capito a 1
    var p1 = Preference{ .usage_count = 2, .total_duration = 2 * 30.0 * 60.0 * 1000.0 };
    const s1 = calculateScore(&p1, 10);
    try std.testing.expectApproxEqAbs(@as(f64, 0.2 * 0.7 + 1.0 * 0.3), s1, 0.000001);
}

test "getTimeBoost usa la quota della fascia corrente" {
    var p = Preference{};
    timePatternAdd(&p.time_patterns, .morning);
    timePatternAdd(&p.time_patterns, .morning);
    timePatternAdd(&p.time_patterns, .afternoon);
    timePatternAdd(&p.time_patterns, .evening);
    // morning=2 su totale 4 -> 0.5
    try std.testing.expectApproxEqAbs(@as(f64, 0.5), getTimeBoost(&p, 8), 0.000001);
    // night=0 -> 0
    try std.testing.expectApproxEqAbs(@as(f64, 0.0), getTimeBoost(&p, 2), 0.000001);

    // nessun pattern -> 0
    const empty = Preference{};
    try std.testing.expectApproxEqAbs(@as(f64, 0.0), getTimeBoost(&empty, 8), 0.000001);
}

test "buildPreferences aggrega usage, durata, time e day patterns" {
    const base: f64 = 1_700_000_000_000.0;
    const its = [_]Interaction{
        .{ .theme_id = 1, .size_id = 0, .day_of_week = 1, .hour_of_day = 9, .timestamp_ms = base, .duration_ms = 60_000 },
        .{ .theme_id = 1, .size_id = 0, .day_of_week = 1, .hour_of_day = 10, .timestamp_ms = base + 1000, .duration_ms = 30_000 },
        .{ .theme_id = 2, .size_id = 1, .day_of_week = 3, .hour_of_day = 20, .timestamp_ms = base, .duration_ms = 120_000 },
    };
    var prefs: [MAX_PREFS]Preference = undefined;
    const n = buildPreferences(&its, &prefs);

    try std.testing.expectEqual(@as(usize, 2), n);

    // tema 1 / size 0
    try std.testing.expectEqual(@as(u8, 1), prefs[0].theme_id);
    try std.testing.expectEqual(@as(u32, 2), prefs[0].usage_count);
    try std.testing.expectApproxEqAbs(@as(f64, 90_000.0), prefs[0].total_duration, 0.001);
    try std.testing.expectApproxEqAbs(@as(f64, base + 1000.0), prefs[0].last_used, 0.001);
    try std.testing.expectEqual(@as(u32, 2), prefs[0].time_patterns.morning);
    try std.testing.expectEqual(@as(u32, 2), prefs[0].day_patterns[1]);

    // tema 2 / size 1
    try std.testing.expectEqual(@as(u32, 1), prefs[1].usage_count);
    try std.testing.expectEqual(@as(u32, 1), prefs[1].time_patterns.evening);
    try std.testing.expectEqual(@as(u32, 1), prefs[1].day_patterns[3]);

    // gli score sono stati calcolati (usageRatio=2/3 -> >0)
    try std.testing.expect(prefs[0].score > 0);
    try std.testing.expect(prefs[1].score > 0);
}

test "recommend ritorna not found sotto MIN_INTERACTIONS" {
    const its = [_]Interaction{.{ .theme_id = 1, .size_id = 0, .day_of_week = 1, .hour_of_day = 9, .timestamp_ms = 0, .duration_ms = 0 }};
    var prefs: [MAX_PREFS]Preference = undefined;
    const r = recommend(&its, &prefs, 9, 1, 1_700_000_000_000.0);
    try std.testing.expectEqual(false, r.found);
}

test "recommend sceglie la combinazione piu usata e calcola la confidence" {
    const base: f64 = 1_700_000_000_000.0;
    // tema 0/size 0 usato 6 volte, tema 1/size 1 usato 1 volta, tutti alle 9 di lunedi'
    var its: [7]Interaction = undefined;
    for (&its, 0..) |*it, i| {
        const theme: u8 = if (i < 6) 0 else 1;
        const size: u8 = if (i < 6) 0 else 1;
        it.* = .{ .theme_id = theme, .size_id = size, .day_of_week = 1, .hour_of_day = 9, .timestamp_ms = base - @as(f64, @floatFromInt(i)) * 1000.0, .duration_ms = 300_000 };
    }
    var prefs: [MAX_PREFS]Preference = undefined;
    const r = recommend(&its, &prefs, 9, 1, base);

    try std.testing.expectEqual(true, r.found);
    try std.testing.expectEqual(@as(u8, 0), r.theme_id);
    try std.testing.expectEqual(@as(u8, 0), r.size_id);
    // confidence = min(1, (6/7)*(7/20)) = 6/20 = 0.3
    try std.testing.expectApproxEqAbs(@as(f64, 0.3), r.confidence, 0.000001);
}

test "recommend applica il boost del giorno corrente" {
    const base: f64 = 1_700_000_000_000.0;
    // Pref A usata 10 volte di martedi' (day 2), Pref B usata 8 volte oggi (day 5).
    // Il boost del giorno (max x1.3) deve far vincere B nonostante l'uso maggiore di A.
    var its: [18]Interaction = undefined;
    var i: usize = 0;
    while (i < 10) : (i += 1) {
        its[i] = .{ .theme_id = 0, .size_id = 0, .day_of_week = 2, .hour_of_day = 12, .timestamp_ms = base - 1000.0, .duration_ms = 300_000 };
    }
    while (i < 18) : (i += 1) {
        its[i] = .{ .theme_id = 1, .size_id = 1, .day_of_week = 5, .hour_of_day = 12, .timestamp_ms = base, .duration_ms = 300_000 };
    }
    var prefs: [MAX_PREFS]Preference = undefined;
    const r = recommend(&its, &prefs, 12, 5, base);

    try std.testing.expectEqual(true, r.found);
    try std.testing.expectEqual(@as(u8, 1), r.theme_id);
    try std.testing.expectEqual(@as(u8, 1), r.size_id);
}
