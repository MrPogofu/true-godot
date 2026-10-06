using System;
using System.Collections.Generic;
using Godot;

namespace Game.Actors;

/// <summary>A player controller written in C#.</summary>
[GlobalClass]
public partial class Player : CharacterBody2D, IDamageable
{
    [Signal] public delegate void HealthChangedEventHandler(int oldValue, int newValue);
    [Export] public float JumpVelocity { get; set; } = -400.0f;

    private const float MaxSpeed = 300.0f;
    private readonly Dictionary<string, int> _inventory = new() { ["coins"] = 3 };
    private int _health = 100;
    public event Action<string>? Died;

    public override void _PhysicsProcess(double delta)
    {
        Vector2 velocity = Velocity;
        if (!IsOnFloor())
            velocity += GetGravity() * (float)delta;
        else if (Input.IsActionJustPressed("jump"))
            velocity.Y = JumpVelocity;

        var direction = Input.GetAxis("move_left", "move_right");
        velocity.X = Mathf.MoveToward(velocity.X, direction * MaxSpeed, 1000f * (float)delta);
        Velocity = velocity;
        MoveAndSlide();
    }

    public async Task<bool> TakeDamage<T>(T source, int amount = 10) where T : Node
    {
        // TODO: armour
        _health = Math.Clamp(_health - amount, 0, 100);
        GD.Print($"Hit by {source.Name}: {_health}\n");
        await ToSignal(GetTree().CreateTimer(0.5), SceneTreeTimer.SignalName.Timeout);
        switch (_health)
        {
            case 0: Died?.Invoke(Name); return true;
            default: return false;
        }
    }
}

public enum State { Idle, Run, Jump }
public record struct Point(int X, int Y);
