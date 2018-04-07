import { CollisionType, Engine, Input, Vector } from "excalibur";
import spriteSheet from "../SpriteSheets/SlawwanSpriteSheet";
import DirectionActor from "./DirectionActor";
import GunFire from "./GunFire";
import { GameService } from "../GameService";
import { Aim } from "./Aim";
import { HealthLine } from "./HealthLine";

export default class InteractionPlayer extends DirectionActor {
  private static readonly speed = 7;

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
    this.collisionType = CollisionType.Active;
  }

  public onInitialize(engine: Engine) {
    super.onInitialize(engine);
    this.aim = new Aim();
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
        up: spriteSheet.walk.up(engine, 50),
        up_right: spriteSheet.walk.up_right(engine, 50),
        up_left: spriteSheet.walk.up_left(engine, 50),
        down: spriteSheet.walk.down(engine, 50),
        down_right: spriteSheet.walk.down_right(engine, 50),
        down_left: spriteSheet.walk.down_left(engine, 50),
        right: spriteSheet.walk.right(engine, 50),
        left: spriteSheet.walk.left(engine, 50)
      }
    });
    engine.input.keyboard.on("press", this.handleKeyPress);
    engine.input.keyboard.on("release", this.handleKeyRelease);

    const healthLine = new HealthLine(0, -90, 150, 130);
    this.add(healthLine);

    engine.input.pointers.primary.on("down", () => {
      if (this.gunFire == null) {
        this.gunFire = new GunFire(() => this.pos);
        engine.currentScene.add(this.gunFire);
      }
    });

    engine.input.pointers.primary.on("up", () => {
      if (this.gunFire != null) {
        this.gunFire.kill();
        this.gunFire = null;
      }
    });
  }

  private sendingDelta: number = 0;
  private lastSentPosition: Vector = Vector.Zero;

  public update(engine: Engine, delta: number) {
    super.update(engine, delta);
    const mousePos = engine.input.pointers.primary.lastWorldPos;
    if (!mousePos) {
      return;
    }
    if (this.aim) {
      this.aim.target = mousePos;
    }
    if (this.gunFire && this.aim) {
      this.gunFire.target = this.aim.pos;
    }
    this.pos.addEqual(this.direction.scale(InteractionPlayer.speed));
    this.sendDataIfNeeded(delta);
  }

  private handleKeyPress = (event?: Input.KeyEvent) => {
    const direction = InteractionPlayer.getDirections(
      (event && event.key) || Input.Keys.Semicolon
    );
    this.direction.addEqual(direction);
  };

  private handleKeyRelease = (event?: Input.KeyEvent) => {
    const direction = InteractionPlayer.getDirections(
      (event && event.key) || Input.Keys.Semicolon
    );
    this.direction.subEqual(direction);
  };

  private sendDataIfNeeded(delta: number) {
    this.sendingDelta += delta;
    if (this.sendingDelta > 15) {
      if (!this.lastSentPosition.sub(this.pos).equals(Vector.Zero)) {
        GameService.move(0, this.pos);
      }
      if (this.gunFire && this.aim) {
        GameService.fire(this.aim.pos);
      }
      this.sendingDelta = 0;
    }
  }
}
