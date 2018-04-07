import * as ex from "excalibur";
import { boomAnimation } from "../SpriteSheets/BoomSpriteSheet";

export default class Boom extends ex.Actor {
  constructor(x: number, y: number, private killCallback: () => void) {
    super(x, y);
    this.killCallback = killCallback;
  }

  public onInitialize(engine: ex.Engine) {
    this.addDrawing("boom", boomAnimation(engine, 50));
    this.setDrawing("boom");
    setTimeout(() => {
      this.killCallback();
    }, 300);
  }
}
