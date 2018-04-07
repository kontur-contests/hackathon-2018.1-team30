import {
  Engine,
  Scene,
  Actor,
  Color,
  TileMap,
  SpriteSheet,
  TileSprite
} from "excalibur";
import Player from "../Chars/Player";
import { Resources } from "../Resources";
import { spriteSheet } from "../SpriteSheets/DudeNudeSpriteSheet";

export class Level1 extends Scene {
  public onInitialize(engine: Engine) {
    const audi = new Player(0, 0);

    this.camera.strategy.elasticToActor(audi, 0.3, 0.9);
    this.add(new Actor(10, 10, 10, 10, Color.Red));
    this.add(new Actor(-10, 10, 10, 10, Color.Red));
    this.add(new Actor(10, -10, 10, 10, Color.Red));
    this.add(new Actor(-10, -10, 10, 10, Color.Red));
    this.add(audi);

    this.add(Resources.Level1.getTileMap());
  }
}
