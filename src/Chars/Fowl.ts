import { CollisionType, Engine, Color, Actor, Random, Vector } from "excalibur";
import checkenSpriteSheet from "../SpriteSheets/ChickensSpritesheet";
import { GunFire } from "./GunFire";
import {
  bloodAnimation,
  bloodAnimation2
} from "../SpriteSheets/BloodSpriteSheet";

export default class Fowl extends Actor {
  isDying: boolean = false;
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
    this.addDrawing("death", bloodAnimation(engine));
    this.addDrawing("death2", bloodAnimation2(engine));

    this.setDrawing(
      ["up", "down", "left", "right"][new Random().integer(0, 3)]
    );
    this.scale = new Vector(2, 2);
  }

  public kill() {
    if (this.isDying) {
      return;
    }
    this.isDying = true;
    this.setDrawing(["death", "death2"][new Random().integer(0, 1)]);

    setTimeout(() => {
      super.kill();
    }, 250);
  }
}
