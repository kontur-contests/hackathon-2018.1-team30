import * as ex from "excalibur";
export class GunFire extends ex.Actor {
  constructor() {
    super(0, 0, 200, 10, ex.Color.Rose);
    this.anchor = new ex.Vector(0, this.anchor.y);
  }

  public isEnabled = false;
  public timeout: number | null = null;
  public target: ex.Vector = ex.Vector.Zero;

  public update(engine: ex.Engine) {
    if (this.isEnabled && !this.isKilled()) {
      this.unkill();
    } else if (!this.isEnabled && this.isKilled()) {
      this.kill();
    }
    this.setWidth(this.target.distance());
    this.rotation = this.target.toAngle();
  }
}
