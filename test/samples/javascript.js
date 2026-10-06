// @ts-check
import { readFile } from "node:fs/promises";
import EventEmitter from "events";

const MAX_SPEED = 300;
let counter = 0x1f;

/**
 * A simple player class.
 * @param {string} name - The player's name.
 */
export class Player extends EventEmitter {
  #health = 100;
  static count = 0;

  constructor(name, options = {}) {
    super();
    this.name = name;
    this.speed = options.speed ?? MAX_SPEED;
    Player.count++;
  }

  get health() {
    return this.#health;
  }

  async load(path) {
    try {
      const data = JSON.parse(await readFile(path, "utf8"));
      for (const [key, value] of Object.entries(data)) {
        if (typeof value === "number" && !Number.isNaN(value)) {
          this[key] = value;
        }
      }
    } catch (err) {
      console.error(`Failed to load ${path}: ${err.message}`);
      throw new Error("load failed");
    } finally {
      this.emit("loaded", this);
    }
  }
}

const re = /^[a-z]+\d{2,}$/gi;
const double = (x) => x * 2;
const player = new Player("Godette", { speed: 250 });
document.querySelector("#app")?.addEventListener("click", () => player.load("save.json"));
export default { MAX_SPEED, double, re, isReady: true, value: null, undef: undefined };
