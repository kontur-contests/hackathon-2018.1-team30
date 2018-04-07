import { CollisionType, Engine, Input, Vector } from "excalibur";
import spriteSheet from "../SpriteSheets/DudeNudeSpriteSheet";
import DirectionActor from "./DirectionActor";
import { GunFire } from "./GunFire";

export default class Player extends DirectionActor {
  gunFire: GunFire;
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

  constructor(x: number, y: number) {
    super(x, y, spriteSheet.width, spriteSheet.height);
    this.collisionType = CollisionType.Passive;
    this.gunFire = new GunFire();
  }

  public onInitialize(engine: Engine) {
    super.onInitialize(engine);
    this.add(this.gunFire);
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
      this.gunFire.isEnabled = true;
    });
    engine.input.pointers.primary.on("up", () => {
      this.gunFire.isEnabled = false;
    });
  }

  public update(engine: Engine, delta: number) {
    super.update(engine, delta);
    // this.pos.addEqual(this.direction.scale(Player.speed));
  }

  private handleKeyPress = (event?: Input.KeyEvent) => {
    clearInterval(Player.loggingTimer);
    const direction = Player.getDirections(
      (event && event.key) || Input.Keys.Semicolon
    );
    console.log(`${this.x}, ${this.y}`);
    Player.loggingTimer = setInterval(() => {
      console.log(`${this.x}, ${this.y}`);
      this.moveTo(event && event.key);
      GameConnections.move(this.takeDirection());
    }, Player.keyPressInterval);
  };

  private handleKeyRelease = (event?: Input.KeyEvent) => {
    const direction = Player.getDirections(
      (event && event.key) || Input.Keys.Semicolon
    );
    this.direction.subEqual(direction);
  };
}
