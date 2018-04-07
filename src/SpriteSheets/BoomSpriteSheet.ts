import * as ex from "excalibur";
import { Resources } from "../Resources";

const spriteSheet = new ex.SpriteSheet(Resources.Boom, 5, 5, 64, 64);

export const boomAnimation = (engine: ex.Engine, speed: number = 50) =>
  spriteSheet.getAnimationBetween(engine, 0, 24, speed);
