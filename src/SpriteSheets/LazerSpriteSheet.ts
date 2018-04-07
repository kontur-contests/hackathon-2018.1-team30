import * as ex from "excalibur";
import { Resources } from "../Resources";

const spriteSheet = new ex.SpriteSheet(Resources.Laser, 1, 11, 200, 50);

export const laserAnimation = (engine: ex.Engine, speed: number = 50) =>
  spriteSheet.getAnimationBetween(engine, 0, 10, speed);
