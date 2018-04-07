import * as ex from "excalibur";
import { Resources } from "../Resources";

const spriteSheet = new ex.SpriteSheet(Resources.Blood1, 6, 1, 70, 70);

export const bloodAnimation = (engine: ex.Engine, speed: number = 50) =>
  spriteSheet.getAnimationBetween(engine, 0, 6, speed);
