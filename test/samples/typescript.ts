import type { Request, Response } from "express";

export interface Vector2 {
  readonly x: number;
  y: number;
}

type State = "idle" | "run" | "jump";

enum Direction {
  Left = -1,
  Right = 1,
}

@Component({ selector: "app-player" })
export abstract class Entity<T extends object = {}> implements Disposable {
  protected position: Vector2 = { x: 0, y: 0 };
  private static readonly registry = new Map<string, Entity>();
  public state: State = "idle";

  constructor(public readonly id: string, private data?: T) {
    Entity.registry.set(id, this);
  }

  abstract update(delta: number): void;

  move(dir: Direction, speed = 10): Vector2 {
    this.position.x += dir * speed;
    return { ...this.position };
  }

  [Symbol.dispose](): void {
    Entity.registry.delete(this.id);
  }
}

export async function handler(req: Request, res: Response): Promise<void> {
  const body = req.body as Partial<Vector2> | undefined;
  if (!body || typeof body.x !== "number") {
    res.status(400).json({ error: `Invalid body: ${JSON.stringify(body)}` });
    return;
  }
  const items: Array<string> = ["a", "b"].map((s) => s.toUpperCase());
  console.log(items satisfies string[], body!.x as unknown as bigint, 10n);
}
