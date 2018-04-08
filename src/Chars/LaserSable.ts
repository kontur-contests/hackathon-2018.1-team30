import * as ex from "excalibur";
import { laserAnimation } from "../SpriteSheets/LazerSpriteSheet";
import Weapon from "./Weapon";
import { Resources } from "../Resources";

export default class LaserSable extends Weapon {
  constructor(private positionProvider: () => ex.Vector) {
    super(0, 0, 400, 50);
    this.collisionType = ex.CollisionType.Passive;
    this.anchor = new ex.Vector(0, this.anchor.y);
  }

  public target: ex.Vector = ex.Vector.Zero;

  public onInitialize(engine: ex.Engine) {
    this.pos = this.positionProvider();
    this.addDrawing("idle", laserAnimation(engine));
    this.setDrawing("idle");
  }

  public update(engine: ex.Engine, delta: number) {
    super.update(engine, delta);
    if (!Resources.LaserSable.isPlaying()) {
      Resources.LaserSable.play();
    }
    const center = this.positionProvider();
    const direction = this.target.normalize();

    this.pos = center.add(direction.scale(1));
    this.body.rotation = this.target.toAngle();
  }
}
