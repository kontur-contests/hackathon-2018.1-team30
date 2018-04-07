import { CollisionType, Engine, Color, Actor, Random, Vector } from "excalibur";
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
    this.addDrawing("up", checkenSpriteSheet.idle.up(engine, 150));
    this.addDrawing("down", checkenSpriteSheet.idle.down(engine, 150));
    this.addDrawing("left", checkenSpriteSheet.idle.left(engine, 150));
    this.addDrawing("right", checkenSpriteSheet.idle.right(engine, 150));
    this.setDrawing(
      ["up", "down", "left", "right"][new Random().integer(0, 3)]
    );
    this.scale = new Vector(2, 2);
  }
}
