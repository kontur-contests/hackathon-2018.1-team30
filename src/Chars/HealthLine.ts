import * as ex from "excalibur";

export class HealthLine extends ex.Actor {
  public healthLine = new ex.UIActor(0, 0, 0, 7);
  public currentHealth = new ex.UIActor(0, 0, 0, 7);

  constructor(
    x: number,
    y: number,
    width: number,
    public maxHealth: number,
    public value: number
  ) {
    super(x, y, width);
  }

  public onInitialize(engine: ex.Engine) {
    super.onInitialize(engine);

    this.healthLine.color = ex.Color.Orange;
    this.currentHealth.color = ex.Color.Red;
    this.healthLine.setWidth(this.getWidth());
    this.currentHealth.setWidth(this.getWidth());
    this.add(this.healthLine);
    this.add(this.currentHealth);
  }

  public update(engine: ex.Engine, delta: number) {
    const proportion = this.getWidth() / this.maxHealth;
    this.currentHealth.setWidth(this.value * proportion);
  }

  public changeHealth(difference: number) {
    this.value = Math.max(0, Math.min(this.maxHealth, this.value + difference));
  }
}
