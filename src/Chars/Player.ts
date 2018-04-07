import { CollisionType, Engine, Vector, UIActor, Color } from "excalibur";
import spriteSheet from "../SpriteSheets/SlawwanSpriteSheet";
import DirectionActor from "./DirectionActor";
import GunFire from "./GunFire";

export default class Player extends DirectionActor {
  private fireTarget: Vector | null = null;
  private gunFire: GunFire | null = null;
  private gunFireKillInterval: number | null = null;

  public nextPosition: Vector = Vector.Zero;

  constructor(x: number, y: number) {
    super(x, y, spriteSheet.width, spriteSheet.height);
    this.collisionType = CollisionType.Active;
  }

  public onInitialize(engine: Engine) {
    super.onInitialize(engine);
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
        up: spriteSheet.walk.up(engine, 75),
        up_right: spriteSheet.walk.up_right(engine, 75),
        up_left: spriteSheet.walk.up_left(engine, 75),
        down: spriteSheet.walk.down(engine, 75),
        down_right: spriteSheet.walk.down_right(engine, 75),
        down_left: spriteSheet.walk.down_left(engine, 75),
        right: spriteSheet.walk.right(engine, 75),
        left: spriteSheet.walk.left(engine, 75)
      }
    });

    const healthLine = new UIActor(0, -40, 0, 10);
    const currentHealth = new UIActor(0, -40, 0, 10);
    healthLine.color = Color.Orange;
    currentHealth.color = Color.Red;
    currentHealth.setWidth(80);
    healthLine.setWidth(100);
    this.add(healthLine);
    this.add(currentHealth);
  }

  public update(engine: Engine, delta: number) {
    super.update(engine, delta);
    const positionDifferent = this.nextPosition.sub(this.pos);
    if (!positionDifferent.equals(Vector.Zero)) {
      this.pos = this.nextPosition;
    }
    if (this.fireTarget) {
      this.direction = positionDifferent;
      if (this.gunFire == null) {
        this.gunFire = new GunFire(() => Vector.Zero);
        this.add(this.gunFire);
      }
      this.gunFire.target = this.fireTarget;
    }
  }

  public set setFireTarget(target: Vector) {
    if (this.gunFireKillInterval) {
      clearInterval(this.gunFireKillInterval);
    }
    this.fireTarget = target;
    this.gunFireKillInterval = setInterval(() => {
      this.fireTarget = null;
      if (this.gunFire) {
        this.remove(this.gunFire);
        this.gunFire = null;
      }
    }, 100);
  }
}
