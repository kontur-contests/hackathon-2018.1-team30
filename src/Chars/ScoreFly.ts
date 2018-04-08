import * as ex from "excalibur";

export default class ScoreFly extends ex.Label {
  private time: number = 0;

  constructor(x: number, y: number, value: number) {
    super(`${value > 0 ? "+" : ""}${value}`, x, y, "15px Origa");
    this.color = value > 0 ? ex.Color.Green : ex.Color.Red;
  }

  public update(engine: ex.Engine, delta: number) {
    this.y = this.y - delta / 1500;
    this.scale = this.scale.scale(1.03);

    this.time += delta;
    if (this.time > 1500) {
      this.kill();
    }
  }
}
