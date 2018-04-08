import {
  CollisionType,
  Engine,
  Color,
  Actor,
  Random,
  Vector,
  Events
} from "excalibur";
import chickenSpritesSpritesheet from "../SpriteSheets/ChickenSpritesheet2";
import {
  bloodAnimation,
  bloodAnimation2
} from "../SpriteSheets/BloodSpriteSheet";
import { GameService } from "../GameService";
import DirectionActor from "./DirectionActor";
import { Resources } from "../Resources";
import Fowl from "./Fowl";
import ScoreFly from "./ScoreFly";
import Weapon from "./Weapon";

export default class ChickenFowl extends Fowl {
  isDying: boolean = false;

  constructor(x: number, y: number) {
    super(
      x,
      y,
      chickenSpritesSpritesheet.width,
      chickenSpritesSpritesheet.height
    );
    this.collisionType = CollisionType.Passive;
  }

  public onInitialize(engine: Engine) {
    super.onInitialize(engine);
    this.addDrawing("up", chickenSpritesSpritesheet.get(engine, 150));
    this.addDrawing("down", chickenSpritesSpritesheet.get(engine, 150));
    this.addDrawing("left", chickenSpritesSpritesheet.get(engine, 150));
    this.addDrawing("right", chickenSpritesSpritesheet.get(engine, 150));
    this.addDrawing("death", bloodAnimation(engine));
    this.addDrawing("death2", bloodAnimation2(engine));

    this.setDrawing(
      ["up", "down", "left", "right"][new Random().integer(0, 3)]
    );
    this.on("precollision", (event?: Events.PreCollisionEvent) => {
      if (
        event &&
        (event.other instanceof DirectionActor || event.other instanceof Weapon)
      ) {
        GameService.killFowl(event.actor);
        engine.currentScene.camera.shake(5, 5, 100);
        const score = new ScoreFly(this.x, this.y, 10);
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
