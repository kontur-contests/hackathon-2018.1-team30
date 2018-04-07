import * as ex  from "excalibur";

export class SmokeEmitter extends ex.ParticleEmitter {
  public emitterType = ex.EmitterType.Rectangle;
  public radius = 5;
  public minVel = 26;
  public maxVel = 26;
  public minAngle = 0;
  public maxAngle = 6.2;
  public isEmitting = true;
  public emitRate = 286;
  public opacity = 0.12;
  public fadeFlag = true;
  public particleLife = 436;
  public maxSize = 4;
  public minSize = 1;
  public startSize = 0;
  public endSize = 0;
  public acceleration = new ex.Vector(0, 309);
  public beginColor = ex.Color.Transparent;
  public endColor = ex.Color.Transparent;
  public width = 0;
  public height = 15;
}


















