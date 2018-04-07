import * as ex from "excalibur";
import { Resources } from "../Resources";

const width = 84;
const height = 48;
const columns = 7;
const rows = 4;

export const checkenSpriteSheet = new ex.SpriteSheet(
  Resources.Chickens,
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
  idle: {
    down: (engine: ex.Engine, speed: number = 75) =>
      checkenSpriteSheet.getAnimationBetween(
        engine,
        getIndex(1, 0),
        getIndex(1, 6),
        speed
      ),
    up: (engine: ex.Engine, speed: number = 75) =>
      checkenSpriteSheet.getAnimationBetween(
        engine,
        getIndex(2, 0),
        getIndex(2, 6),
        speed
      ),
    left: (engine: ex.Engine, speed: number = 75) =>
      checkenSpriteSheet.getAnimationBetween(
        engine,
        getIndex(0, 0),
        getIndex(0, 6),
        speed
      ),
    right: (engine: ex.Engine, speed: number = 75) =>
      checkenSpriteSheet.getAnimationBetween(
        engine,
        getIndex(3, 0),
        getIndex(3, 6),
        speed
      )
  }
};
