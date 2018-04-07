import { Actor, Engine, Input, Vector } from "excalibur";
import { Resources } from "../Resources";
import { SmokeEmitter } from "./SmokeEmitter";

const width = Resources.Audi.width;
const height = Resources.Audi.height;

export class Audi extends Actor {
  private speed: number = 0;
  private acceleration: number = 0.2;
  private damping: number = 0.05;
  private maxSpeed: number = 6;
  private minSpeed: number = -2;
  private rotationSpeed: number = 0.01;

  constructor(x: number, y: number) {
    super(x, y, width, height);
  }

  public onInitialize(engine: Engine) {
    this.initDrawing();
    this.initKeyboard(engine);

    const smokeEmitter = new SmokeEmitter();
    this.add(smokeEmitter);
  }

  public update() {
    this.pos.addEqual(
      new Vector(0, -1).scale(this.speed).rotate(this.rotation)
    );
    if (this.speed > 0) {
      this.speed = Math.max(this.speed - this.damping / 2, 0);
    }
    if (this.speed < 0) {
      this.speed = Math.min(this.speed + this.damping / 2, 0);
    }
  }

  private initKeyboard(engine: Engine) {
    engine.input.keyboard.on("hold", evt => {
      if (evt) {
        switch (evt.key) {
          case Input.Keys.Up:
            this.speed = Math.min(
              this.speed + this.acceleration,
              this.maxSpeed
            );
            break;
          case Input.Keys.Right:
            this.rotation += this.rotationSpeed * this.speed;
            break;

          case Input.Keys.Left:
            this.rotation -= this.rotationSpeed * this.speed;
            break;
          case Input.Keys.Down:
            this.speed = Math.max(this.speed - this.damping, this.minSpeed);
            break;
        }
      }
    });
  }

  private initDrawing() {
    this.rotation = 0;
    this.addDrawing(Resources.Audi);
    this.scale = new Vector(0.5, 0.5);
  }
}
