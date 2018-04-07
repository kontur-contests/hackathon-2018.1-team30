import * as ex from "excalibur";

import { Resources } from "../Resources";

const MAX_AIM_DISTANCE = 200;

export class Aim extends ex.Actor {
  onInitialize(engine: ex.Engine) {
    this.addDrawing(Resources.Aim);
  }

  public update(engine: ex.Engine, delta: number) {
    const mousePos = engine.input.pointers.primary.lastWorldPos;
    if (!mousePos) {
      return;
    }
    const parentPos = this.parent.pos;
    const relativeVec = new ex.Vector(
      mousePos.x - parentPos.x,
      mousePos.y - parentPos.y
    );
    const dist = Math.min(MAX_AIM_DISTANCE, relativeVec.distance());
    this.pos = new ex.Vector(0, dist)
      .rotate(relativeVec.toAngle())
      .rotate(-Math.PI / 2);
  }
}
