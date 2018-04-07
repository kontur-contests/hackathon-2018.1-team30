import {Engine, SpriteSheet} from "excalibur";
import {Resources} from "../Resources";

const width = 64;
const height = 64;
const columns = 13;
const rows = 21;

const spriteSheet = new SpriteSheet({
    columns,
    rows,
    spHeight: height,
    spWidth: width,
    image: Resources.DudeNude
});

function getIndex(row: number, column: number = 0) : number {
    return columns * row + column;
}

export default {
    width,
    height,
    columns,
    rows,
    idle: {
        down: () => spriteSheet.getSprite(getIndex(2)),
        up: () => spriteSheet.getSprite(getIndex(0)),
        left: () => spriteSheet.getSprite(getIndex(1)),
        right: () => spriteSheet.getSprite(getIndex(3))
    },
    walk: {
        left: (engine: Engine, speed: number = 75) => spriteSheet.getAnimationBetween(engine, getIndex(9), getIndex(9, 9), speed),
        right: (engine: Engine, speed: number = 75) => spriteSheet.getAnimationBetween(engine, getIndex(11), getIndex(11, 9), speed),
        up: (engine: Engine, speed: number = 75) => spriteSheet.getAnimationBetween(engine, getIndex(8), getIndex(8, 9), speed),
        down: (engine: Engine, speed: number = 75) => spriteSheet.getAnimationBetween(engine, getIndex(10), getIndex(10, 9), speed)
    }
};