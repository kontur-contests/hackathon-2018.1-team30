import { CollisionType, Engine, Input, Vector } from "excalibur";
import spriteSheet from "../SpriteSheets/DudeNudeSpriteSheet";
import DirectionActor from "./DirectionActor";
import { GunFire } from "./GunFire";
import { GameService } from "../GameService";
import { Directions } from "../models/Player";
import { Aim } from "./Aim";

export default class InteractionPlayer extends DirectionActor {
  private static readonly speed = 5;
  private static readonly keyPressInterval = 75;

  private static loggingTimer = 0;

  private static getDirections = (key: Input.Keys) => {
    switch (key) {
      case Input.Keys.A:
        return Vector.Left;
      case Input.Keys.W:
        return Vector.Up;
      case Input.Keys.D:
        return Vector.Right;
      case Input.Keys.S:
        return Vector.Down;
      default:
        return Vector.Zero;
    }
  };

  private gunFire: GunFire | null = null;
  private aim: Aim | null = null;

  constructor(x: number, y: number) {
    super(x, y, spriteSheet.width, spriteSheet.height);
    this.collisionType = CollisionType.Passive;
  }

  public onInitialize(engine: Engine) {
    super.onInitialize(engine);
    this.gunFire = new GunFire();
    this.aim = new Aim();
    this.add(this.gunFire);
    this.add(this.aim);
    this.registerDrawing({
      idle: {
        up: spriteSheet.idle.up(),
        down: spriteSheet.idle.down(),
        right: spriteSheet.idle.right(),
        left: spriteSheet.idle.left(),
        up_left: spriteSheet.idle.up_left(),
        up_right: spriteSheet.idle.up_right(),
        down_left: spriteSheet.idle.down_left(),
        down_right: spriteSheet.idle.down_left()
      },
      walk: {
        up: spriteSheet.walk.up(engine, 150),
        up_right: spriteSheet.walk.up(engine, 150),
        up_left: spriteSheet.walk.up(engine, 150),
        down: spriteSheet.walk.down(engine, 150),
        down_right: spriteSheet.walk.down(engine, 150),
        down_left: spriteSheet.walk.down(engine, 150),
        right: spriteSheet.walk.right(engine, 150),
        left: spriteSheet.walk.left(engine, 150)
      }
    });
    engine.input.keyboard.on("press", this.handleKeyPress);
    engine.input.keyboard.on("release", this.handleKeyRelease);

    engine.input.pointers.primary.on("down", () => {
      this.gunFire != null && (this.gunFire.isEnabled = true);
    });
    engine.input.pointers.primary.on("up", () => {
      this.gunFire != null && (this.gunFire.isEnabled = false);
    });
  }

  private sendingDelta: number = 0;
  private num: number = 0;

  public update(engine: Engine, delta: number) {
    super.update(engine, delta);
    this.sendingDelta += delta;

    if (this.sendingDelta > 100) {
      GameService.move(
        this.num,
        this.pos.add(this.direction.scale(InteractionPlayer.speed))
      );
      this.num++;
      this.sendingDelta = 0;
    }

    if (this.gunFire && this.gunFire.isEnabled) {
      if (this.aim) {
        GameService.fire(this.aim.pos);
      }
    }
  }

  private handleKeyPress = (event?: Input.KeyEvent) => {
    clearInterval(InteractionPlayer.loggingTimer);
    const direction = InteractionPlayer.getDirections(
      (event && event.key) || Input.Keys.Semicolon
    );
    this.direction.addEqual(direction);
  };

  private handleKeyRelease = (event?: Input.KeyEvent) => {
    clearInterval(InteractionPlayer.loggingTimer);
    const direction = InteractionPlayer.getDirections(
      (event && event.key) || Input.Keys.Semicolon
    );
    this.direction.subEqual(direction);
  };
}
