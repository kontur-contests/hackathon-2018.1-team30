import { Engine, Scene } from "excalibur";
import { Audi } from "../Chars/Audi";
import { Resources } from "../Resources";

export class Level1 extends Scene {
  public onInitialize(engine: Engine) {
    this.add(Resources.Level1.getTileMap());
    this.add(new Audi(100, 100));
  }
}
