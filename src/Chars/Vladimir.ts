import * as ex from "excalibur";
import { Resources } from "../Resources";
import Weapon from "./Weapon";

export default class Vladimir extends Weapon {
  constructor(private positionProvider: () => ex.Vector) {
    super(0, 0, 2400, 1200);
    this.collisionType = ex.CollisionType.Passive;
  }

  public target: ex.Vector = ex.Vector.Zero;

  public onInitialize(engine: ex.Engine) {
    this.pos = this.positionProvider();
    this.addDrawing("idle", Resources.Vladimir.asSprite());
    this.setDrawing("idle");
  }

  public update(engine: ex.Engine, delta: number) {
    super.update(engine, delta);
    this.pos = this.positionProvider();
  }
}
