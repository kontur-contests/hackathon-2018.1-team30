import * as ex from "excalibur";

export default class Score extends ex.Label {
  constructor(x: number, y: number, public value: number) {
    super(value.toString(), x, y, "15px Origa");
  }

  public update(engine: ex.Engine, delta: number) {
    this.text = this.value.toString();
    this.scale = this.scale.scale(this.value / 10000 + 1);
    if (this.value < 1000) {
      this.color = ex.Color.White;
    } else if (this.value < 5000) {
      this.color = ex.Color.Yellow;
    } else if (this.value < 10000) {
      this.color = ex.Color.Orange;
    } else {
      this.color = ex.Color.Red;
    }
  }
}
