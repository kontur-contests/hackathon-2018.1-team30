import { DisplayMode, Engine, Loader } from "excalibur";
import { Level1 } from "./Scenes/Level1";

export class Game extends Engine {
  constructor() {
    super({
      displayMode: DisplayMode.FullScreen,
    });
  }

  public start(loader: Loader) {
    this.add("level1", new Level1());

    return super.start(loader).then(() => {
      this.goToScene("level1");
    });
  }
}
