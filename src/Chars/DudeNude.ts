import { Actor, Engine, SpriteSheet } from "excalibur";
import { Resources } from "../Resources";

const width = 64;
const height = 64;

const SpriteInfo = {
  cols: 13,
  rows: 21
};

export class DudeNude extends Actor {
  constructor(x: number, y: number) {
    super(x, y, width, height);
  }

  public onInitialize(engine: Engine) {
    const spriteSheet = new SpriteSheet(
      Resources.DudeNude,
      SpriteInfo.cols,
      SpriteInfo.rows,
      width,
      height
    );

    const castAnimation = spriteSheet.getAnimationBetween(
      engine,
      SpriteInfo.cols * 2,
      SpriteInfo.cols * 2 + 6,
      100
    );

    this.addDrawing("cast", castAnimation);
    this.setDrawing("cast");
  }
}
