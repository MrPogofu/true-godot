package com.example.game;

import java.util.*;
import java.util.function.Function;

/**
 * A simple entity.
 * @author Mr Pogofu
 */
@SuppressWarnings("unchecked")
public abstract sealed class Entity<T extends Comparable<T>> implements Runnable permits Player {
    public static final int MAX_HEALTH = 100;
    protected final Map<String, List<Integer>> stats = new HashMap<>();
    private volatile boolean alive = true;

    @Override
    public void run() {
        // TODO: tick logic
        for (int i = 0; i < 10; i++) {
            if (!alive) break;
            System.out.printf("Tick %d%n", i);
        }
    }

    public abstract T score();
}

final class Player extends Entity<Integer> {
    private int points = 0b1010;

    @Override
    public Integer score() {
        Function<Integer, Integer> doubled = x -> x * 2;
        try {
            return doubled.apply(points);
        } catch (ArithmeticException e) {
            throw new IllegalStateException("bad score: " + e.getMessage());
        } finally {
            this.points = 0;
        }
    }

    record Pos(double x, double y) {}
    String describe(Object o) {
        return switch (o) { case Pos p -> "pos " + p.x(); default -> null; };
    }
}
