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
    const spriteSheet = new SpriteSheet({
      columns: SpriteInfo.cols,
      rows: SpriteInfo.rows,
      spHeight: height,
      spWidth: width,
      image: Resources.DudeNude
    });

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
