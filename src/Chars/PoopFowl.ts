import { Engine, Color, Actor, Random, Vector, CollisionType } from "excalibur";
import poopSpriteSheet from "../SpriteSheets/PoopSpritesSheet";
import Boom from "./Boom";

export default class PoopFowl extends Actor {
  private boom: Boom | null = null;

  constructor(x: number, y: number) {
    super(x, y, poopSpriteSheet.width, poopSpriteSheet.height, Color.White);
    this.collisionType = CollisionType.Passive;
    this.scale = new Vector(0.5, 0.5);
  }

  public onInitialize(engine: Engine) {
    super.onInitialize(engine);
    this.addDrawing("down", poopSpriteSheet.idle.down(engine));
    this.addDrawing("death", poopSpriteSheet.dead(engine));

    this.setDrawing("down");
    this.on("prekill", () => {});
  }

  public explode() {
    if (this.boom == null) {
      this.setDrawing("death");
      this.boom = new Boom(0, 0, () => {
        if (this.boom != null) {
          this.remove(this.boom);
        }
      });

      this.boom.scale = new Vector(5, 5);
      this.add(this.boom);
      setTimeout(() => this.kill(), 900);
    }
  }
}
