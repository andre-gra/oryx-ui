const std = @import("std");

pub fn build(b: *std.Build) void {
    // Target fisso: wasm32, nessun OS (freestanding).
    const target = b.resolveTargetQuery(.{
        .cpu_arch = .wasm32,
        .os_tag = .freestanding,
    });
    const optimize = b.standardOptimizeOption(.{ .preferred_optimize_mode = .ReleaseSmall });

    const wasm = b.addExecutable(.{
        .name = "oryx-engine",
        .root_module = b.createModule(.{
            .root_source_file = b.path("src/engine.zig"),
            .target = target,
            .optimize = optimize,
        }),
    });

    // Modulo "libreria": nessuna entry point, esportiamo solo gli `export fn`.
    wasm.entry = .disabled;
    // Mantiene i simboli esportati e consente il linking con rdynamic.
    wasm.rdynamic = true;
    // Espone la linear memory a JS (necessario per leggere i buffer).
    wasm.export_memory = true;

    // Installa direttamente il .wasm dentro src/engine, dove vive il binding TS.
    // (custom e' relativo al prefix -> oryx-engine/zig-out/../../src/engine)
    const install = b.addInstallArtifact(wasm, .{
        .dest_dir = .{ .override = .{ .custom = "../../src/engine" } },
        .dest_sub_path = "oryx-engine.wasm",
    });
    b.getInstallStep().dependOn(&install.step);

    // `zig build test` esegue i test nativi (host) di color.zig e theme.zig.
    const test_step = b.step("test", "Run native Zig tests");
    const test_color = b.addTest(.{
        .root_module = b.createModule(.{
            .root_source_file = b.path("src/color.zig"),
            .target = b.resolveTargetQuery(.{}),
            .optimize = optimize,
        }),
    });
    const test_theme = b.addTest(.{
        .root_module = b.createModule(.{
            .root_source_file = b.path("src/theme.zig"),
            .target = b.resolveTargetQuery(.{}),
            .optimize = optimize,
        }),
    });
    const test_agent = b.addTest(.{
        .root_module = b.createModule(.{
            .root_source_file = b.path("src/agent.zig"),
            .target = b.resolveTargetQuery(.{}),
            .optimize = optimize,
        }),
    });
    test_step.dependOn(&b.addRunArtifact(test_color).step);
    test_step.dependOn(&b.addRunArtifact(test_theme).step);
    test_step.dependOn(&b.addRunArtifact(test_agent).step);
}
