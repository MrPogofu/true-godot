const std = @import("std");

const Vec2 = struct {
    x: f32,
    y: f32,

    pub fn add(self: Vec2, other: Vec2) Vec2 {
        return .{ .x = self.x + other.x, .y = self.y + other.y };
    }
};

pub fn main() !void {
    const stdout = std.io.getStdOut().writer();
    var list = std.ArrayList(u32).init(std.heap.page_allocator);
    defer list.deinit();
    try list.append(42);
    // print the result
    try stdout.print("Hello {s}: {d}\n", .{ "Zig", list.items.len });
    if (list.items.len == 0) unreachable;
}
