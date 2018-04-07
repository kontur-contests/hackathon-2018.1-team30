import { Engine, SpriteSheet } from "excalibur";
import { Resources } from "../Resources";

const width = 128;
const height = 128;
const columns = 3;
const rows = 8;

export const spriteSheet = new SpriteSheet(
  Resources.Slawwan,
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
    down: () => spriteSheet.getSprite(getIndex(4)),
    down_left: () => spriteSheet.getSprite(getIndex(1)),
    down_right: () => spriteSheet.getSprite(getIndex(6)),
    up: () => spriteSheet.getSprite(getIndex(0)),
    up_left: () => spriteSheet.getSprite(getIndex(7)),
    up_right: () => spriteSheet.getSprite(getIndex(5)),
    left: () => spriteSheet.getSprite(getIndex(3)),
    right: () => spriteSheet.getSprite(getIndex(4))
  },
  walk: {
    left: (engine: Engine, speed: number = 75) =>
      spriteSheet.getAnimationBetween(
        engine,
        getIndex(2),
        getIndex(2, 2),
        speed
      ),
    right: (engine: Engine, speed: number = 75) =>
      spriteSheet.getAnimationBetween(
        engine,
        getIndex(3),
        getIndex(3, 2),
        speed
      ),
    up: (engine: Engine, speed: number = 75) =>
      spriteSheet.getAnimationBetween(
        engine,
        getIndex(0),
        getIndex(0, 2),
        speed
      ),
    down: (engine: Engine, speed: number = 75) =>
      spriteSheet.getSprite(getIndex(4)),
    up_left: (engine: Engine, speed: number = 75) =>
      spriteSheet.getSprite(getIndex(7)),
    up_right: (engine: Engine, speed: number = 75) =>
      spriteSheet.getSprite(getIndex(5)),
    down_left: (engine: Engine, speed: number = 75) =>
      spriteSheet.getAnimationBetween(
        engine,
        getIndex(1),
        getIndex(1, 2),
        speed
      ),
    down_right: (engine: Engine, speed: number = 75) =>
      spriteSheet.getSprite(getIndex(6))
  }
};
