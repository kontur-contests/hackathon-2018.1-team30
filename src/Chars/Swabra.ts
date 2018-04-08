import * as ex from "excalibur";
import { Resources } from "../Resources";
import Weapon from "./Weapon";

export default class Swabra extends Weapon {
  constructor(private positionProvider: () => ex.Vector) {
    super(0, 0, 50, 230);
    this.collisionType = ex.CollisionType.Passive;
    this.anchor = new ex.Vector(this.anchor.x, 0);
  }

  public target: ex.Vector = ex.Vector.Zero;

  public onInitialize(engine: ex.Engine) {
    this.pos = this.positionProvider();
    this.addDrawing("idle", Resources.Swabra.asSprite());
    this.setDrawing("idle");
  }

  public update(engine: ex.Engine, delta: number) {
    super.update(engine, delta);
    const center = this.positionProvider();
    const direction = this.target.normalize();

    this.pos = center.add(direction.scale(5));
    this.body.rotation = this.target.toAngle() - Math.PI / 2;
  }
}
