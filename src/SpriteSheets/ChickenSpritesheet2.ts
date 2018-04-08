import * as ex from "excalibur";
import { Resources } from "../Resources";

const width = 48;
const height = 48;
const columns = 12;
const rows = 8;

const random = new ex.Random();
export const chickenSpriteSheet = new ex.SpriteSheet(
  Resources.Chickens2,
  columns,
  rows,
  width,
  height
);

function getIndex(row: number, column: number = 0): number {
  return columns * row + column;
}

export default {
  width,
  height,
  columns,
  rows,
  get: (engine: ex.Engine, speed: number = 50) => {
    const number = random.integer(0, 7);
    return chickenSpriteSheet.getAnimationBetween(
      engine,
      number * 3,
      number * 3 + 2,
      speed
    );
  }
};
