import { CollisionType, Engine, Color, Actor, Random } from "excalibur";
import checkenSpriteSheet from "../SpriteSheets/ChickensSpritesheet";
import DirectionActor from "./DirectionActor";
import { GunFire } from "./GunFire";

export default class Fowl extends Actor {
  constructor(x: number, y: number) {
    super(x, y, checkenSpriteSheet.width, checkenSpriteSheet.height);
    this.collisionType = CollisionType.Passive;
  }

  public onInitialize(engine: Engine) {
    super.onInitialize(engine);
    this.addDrawing("up", checkenSpriteSheet.idle.up(engine));
    this.addDrawing("down", checkenSpriteSheet.idle.down(engine));
    this.addDrawing("left", checkenSpriteSheet.idle.left(engine));
    this.addDrawing("right", checkenSpriteSheet.idle.right(engine));
    this.setDrawing(
      ["up", "down", "left", "right"][new Random().integer(0, 3)]
    );
  }
}
