import { Engine, Scene } from "excalibur";
import { Audi } from "../Chars/Audi";

export class Level1 extends Scene {
  public onInitialize(engine: Engine) {
    const audi = new Audi(
      100,
      100
    );
    this.add(audi);
  }
}
