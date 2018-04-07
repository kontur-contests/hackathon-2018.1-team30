import { CollisionType, Engine, Vector } from "excalibur";
import spriteSheet from "../SpriteSheets/DudeNudeSpriteSheet";
import DirectionActor from "./DirectionActor";
import { GunFire } from "./GunFire";

export default class Player extends DirectionActor {
  public gunFire: GunFire;

  constructor(x: number, y: number) {
    super(x, y, spriteSheet.width, spriteSheet.height);
    this.collisionType = CollisionType.Passive;
    this.gunFire = new GunFire();
  }

  private nextPosition: Vector = Vector.Zero;

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
  }

  public update(engine: Engine, delta: number) {
    const positionDifferent = this.pos.sub(this.nextPosition);
    if (!positionDifferent.equals(Vector.Zero)) {
      this.direction = this.pos.sub(this.nextPosition);
      this.actions.moveBy(this.nextPosition.x, this.nextPosition.y, 25);
    }
  }

  public changePosition(nextPosition: Vector) {
    this.nextPosition = nextPosition;
  }
}
