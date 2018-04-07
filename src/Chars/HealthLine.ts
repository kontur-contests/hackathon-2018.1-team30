import * as ex from 'excalibur';

export class HealthLine extends ex.Actor {
  width: number;
  value: number;

  public healthLine = new ex.UIActor(0, 0, 0, 15);
  public currentHealth = new ex.UIActor(0, 0, 0, 15);

  constructor(x: number, y: number, w: number, v: number) {
    super(x, y);
    this.width = w;
    this.value = v;
    this.collisionType = ex.CollisionType.Passive;
  }

  public onInitialize(engine: ex.Engine) {
    super.onInitialize(engine);

    this.healthLine.color = ex.Color.Orange;
    this.currentHealth.color = ex.Color.Red;
    this.healthLine.setWidth(this.width);
    this.currentHealth.setWidth(Math.random() * this.value);
    this.add(this.healthLine);
    this.add(this.currentHealth);
  }

  public onChangeHP(factor: number) {
    this.value = this.value - factor;
    this.currentHealth.setWidth(this.value);
  }
}
