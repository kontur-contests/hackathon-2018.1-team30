import * as ex from 'excalibur';

export class HealthLine extends ex.Actor {
  width: number;
  value: number;

  constructor(x: number, y: number, w: number, v: number) {
    super(x, y);
    this.width = w;
    this.value = v;
    this.collisionType = ex.CollisionType.Passive;
  }

  public onInitialize(engine: ex.Engine) {
    super.onInitialize(engine);
    const healthLine = new ex.UIActor(0, 0, 0, 15);
    const currentHealth = new ex.UIActor(0, 0, 0, 15);
    healthLine.color = ex.Color.Orange;
    currentHealth.color = ex.Color.Red;
    currentHealth.setWidth(this.value);
    healthLine.setWidth(this.width);
    this.add(healthLine);
    this.add(currentHealth);
  }
}
