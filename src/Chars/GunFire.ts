import * as ex from "excalibur";
export class GunFire extends ex.Actor {
  constructor() {
    super(0, 0, 200, 10, ex.Color.Rose);
    this.anchor = new ex.Vector(0, this.anchor.y);

    this.on("precollision", ev => {
      if (ev) {
        ev.other.setDrawing("death");
        setTimeout(() => {
          ev.other.kill();
        }, 400);
      }
    });
  }
  public target: ex.Vector = ex.Vector.Zero;

  public update(engine: ex.Engine) {
    this.setWidth(this.target.distance());
    this.rotation = this.target.toAngle();
  }
}
