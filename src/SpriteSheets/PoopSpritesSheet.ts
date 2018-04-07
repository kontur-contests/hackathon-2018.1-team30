import * as ex from "excalibur";
import { Resources } from "../Resources";

const width = 64;
const height = 64;
const columns = 8;
const rows = 7;

export const poopSpriteSheet = new ex.SpriteSheet(
  Resources.Poop,
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
      poopSpriteSheet.getAnimationBetween(
        engine,
        getIndex(3, 0),
        getIndex(3, 5),
        speed
      )
  },
  dead: (engine: ex.Engine, speed: number = 75) =>
    poopSpriteSheet.getAnimationBetween(
      engine,
      getIndex(5, 0),
      getIndex(6, 7),
      speed
    )
};
