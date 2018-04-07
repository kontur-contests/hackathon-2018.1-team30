import {
  CollisionType,
  Engine,
  Color,
  Actor,
  Random,
  Vector,
  Events
} from "excalibur";
import checkenSpriteSheet from "../SpriteSheets/ChickensSpritesheet";
import { bloodAnimation } from "../SpriteSheets/BloodSpriteSheet";
import { GameService } from "../GameService";
import DirectionActor from "./DirectionActor";
import GunFire from "./GunFire";

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
    this.addDrawing("death", bloodAnimation(engine));

    this.setDrawing(
      ["up", "down", "left", "right"][new Random().integer(0, 3)]
    );
    this.scale = new Vector(2, 2);
    this.on("precollision", (event?: Events.PreCollisionEvent) => {
      if (
        event &&
        (event.other instanceof DirectionActor ||
          event.other instanceof GunFire)
      ) {
        GameService.killFowl(event.other);
        this.kill();
      }
    });
  }

  public kill() {
    this.setDrawing("death");
    setTimeout(() => {
      super.kill();
    }, 400);
  }
}
