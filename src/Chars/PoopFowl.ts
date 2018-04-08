import { Engine, Color, Actor, Random, Vector, CollisionType } from "excalibur";
import poopSpriteSheet from "../SpriteSheets/PoopSpritesSheet";
import Boom from "./Boom";
import { PreCollisionEvent } from "Events";
import { GameService } from "../GameService";
import DirectionActor from "./DirectionActor";
import GunFire from "./GunFire";
import { Resources } from "../Resources";

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
    this.on("precollision", (event?: PreCollisionEvent) => {
      if (
        event &&
        (event.other instanceof DirectionActor ||
          event.other instanceof GunFire)
      ) {
        GameService.killFowl(event.actor);
        engine.currentScene.camera.shake(10, 10, 100);
        this.kill();
      }
    });
  }

  public kill() {
    if (this.boom == null) {
      Resources.Explosion.play(0.6);
      this.setDrawing("death");
      this.boom = new Boom(0, 0, () => {
        if (this.boom != null) {
          this.remove(this.boom);
        }
      });

      this.boom.scale = new Vector(5, 5);
      this.add(this.boom);
      setTimeout(() => super.kill(), 900);
    }
  }
}
