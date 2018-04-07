import * as ex from "excalibur";
const MAX_AIM_DISTANCE = 200;
export class GunFire extends ex.Actor {
  constructor(public isInterection: boolean = false) {
    super(0, 0, 200, 10, ex.Color.Rose);
    this.anchor = new ex.Vector(0, this.anchor.y);
  }

  public isEnabled = false;
  public timeout: number | null = null;

  public update(engine: ex.Engine) {
    if (this.isEnabled) {
      this.color = ex.Color.Red;
    } else {
      this.color = ex.Color.Transparent;
    }
    if (!this.isInterection) {
      return;
    }
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
    this.setWidth(dist);
    this.rotation = relativeVec.toAngle();
  }

  public activate(vector: ex.Vector) {
    this.setWidth(vector.distance());
    this.rotation = vector.toAngle();
    this.isEnabled = true;
  }

  public deactivate() {
    this.isEnabled = false;
  }
}
