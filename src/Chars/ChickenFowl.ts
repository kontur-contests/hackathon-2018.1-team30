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
import {
  bloodAnimation,
  bloodAnimation2
} from "../SpriteSheets/BloodSpriteSheet";
import { GameService } from "../GameService";
import DirectionActor from "./DirectionActor";
import GunFire from "./GunFire";
import { Resources } from "../Resources";
import Fowl from "./Fowl";
import Score from "./Score";

export default class ChickenFowl extends Fowl {
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
    this.on("precollision", (event?: Events.PreCollisionEvent) => {
      if (
        event &&
        (event.other instanceof DirectionActor ||
          event.other instanceof GunFire)
      ) {
        GameService.killFowl(event.actor);
        engine.currentScene.camera.shake(10, 10, 100);
        const score = new Score(this.x, this.y, 10, actor =>
          engine.currentScene.remove(actor)
        );
        engine.currentScene.add(score);
        this.kill();
      }
    });
  }

  public kill() {
    if (this.isDying) {
      return;
    }
    Resources.Chicken.play();
    this.isDying = true;
    this.setDrawing(["death", "death2"][new Random().integer(0, 1)]);

    setTimeout(() => {
      super.kill();
    }, 250);
  }
}
