import * as ex from "excalibur";
import { Resources } from "../Resources";

const MAX_AIM_DISTANCE = 500;

export class Aim extends ex.Actor {
  public target: ex.Vector = ex.Vector.Zero;

  constructor(private positionProvider: () => ex.Vector) {
    super();
  }

  onInitialize(engine: ex.Engine) {
    this.addDrawing(Resources.Aim);
    this.pos = this.positionProvider();
  }

  public update(engine: ex.Engine, delta: number) {
    const parentPos = this.positionProvider();
    const relativeVec = this.target.sub(parentPos);
    const dist = Math.min(MAX_AIM_DISTANCE, relativeVec.distance());
    this.pos = new ex.Vector(0, dist)
      .rotate(relativeVec.toAngle())
      .rotate(-Math.PI / 2);

    console.log(this.pos);
  }
}
