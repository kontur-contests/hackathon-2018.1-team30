import * as ex from "excalibur";
import spriteSheetFactory from "../SpriteSheets/SlawwanSpriteSheet";
import DirectionActor from "./DirectionActor";
import GunFire from "./GunFire";
import { GameService } from "../GameService";
import { Aim } from "./Aim";
import { HealthLine } from "./HealthLine";
import ChickenFowl from "./ChickenFowl";
import PoopFowl from "./PoopFowl";

const spriteSheet = spriteSheetFactory();

export default class InteractionPlayer extends DirectionActor {
  private static readonly speed = 7;

  private static getDirections = (key: ex.Input.Keys) => {
    switch (key) {
      case ex.Input.Keys.A:
        return ex.Vector.Left;
      case ex.Input.Keys.W:
        return ex.Vector.Up;
      case ex.Input.Keys.D:
        return ex.Vector.Right;
      case ex.Input.Keys.S:
        return ex.Vector.Down;
      default:
        return ex.Vector.Zero;
    }
  };

  private gunFire: GunFire | null = null;
  private aim: Aim | null = null;
  private readonly healthBar: HealthLine;

  constructor(x: number, y: number) {
    super(x, y, spriteSheet.width, spriteSheet.height);
    this.collisionType = ex.CollisionType.Active;
    const area = new ex.Actor(x, y, 20, 60).collisionArea;
    area.body = this.body;
    this.collisionArea = area;
    this.healthBar = new HealthLine(-40, -100, 100, 300, 300);
  }

  public onInitialize(engine: ex.Engine) {
    super.onInitialize(engine);
    this.aim = new Aim();
    this.add(this.aim);
    this.registerDrawing({
      idle: {
        up: spriteSheet.idle.up(),
        down: spriteSheet.idle.down(),
        right: spriteSheet.idle.right(),
        left: spriteSheet.idle.left(),
        up_left: spriteSheet.idle.up_left(),
        up_right: spriteSheet.idle.up_right(),
        down_left: spriteSheet.idle.down_left(),
        down_right: spriteSheet.idle.down_left()
      },
      walk: {
        up: spriteSheet.walk.up(engine, 50),
        up_right: spriteSheet.walk.up_right(engine, 50),
        up_left: spriteSheet.walk.up_left(engine, 50),
        down: spriteSheet.walk.down(engine, 50),
        down_right: spriteSheet.walk.down_right(engine, 50),
        down_left: spriteSheet.walk.down_left(engine, 50),
        right: spriteSheet.walk.right(engine, 50),
        left: spriteSheet.walk.left(engine, 50)
      }
    });
    engine.input.keyboard.on("press", this.handleKeyPress);
    engine.input.keyboard.on("release", this.handleKeyRelease);
    this.add(this.healthBar);

    engine.input.pointers.primary.on("down", () => {
      if (this.gunFire == null) {
        this.gunFire = new GunFire(() => this.pos);
        engine.currentScene.add(this.gunFire);
      }
    });

    engine.input.pointers.primary.on("up", () => {
      if (this.gunFire != null) {
        this.gunFire.kill();
        this.gunFire = null;
      }
    });

    this.on("postcollision", (event?: ex.PostCollisionEvent) => {
      if (event) {
        if (event.other instanceof ChickenFowl) {
          this.healthBar.changeHealth(30);
        } else if (event.other instanceof PoopFowl) {
          this.healthBar.changeHealth(-10);
        } else if (event.other instanceof GunFire) {
          this.healthBar.changeHealth(-1);
        }
      }
    });
  }

  private sendingDelta: number = 0;
  private lastSentPosition: ex.Vector = ex.Vector.Zero;

  public update(engine: ex.Engine, delta: number) {
    super.update(engine, delta);
    const mousePos = engine.input.pointers.primary.lastWorldPos;
    if (!mousePos) {
      return;
    }
    if (this.aim) {
      this.aim.target = mousePos;
    }
    if (this.gunFire && this.aim) {
      this.gunFire.target = this.aim.pos;
    }
    this.pos.addEqual(this.direction.scale(InteractionPlayer.speed));
    this.sendDataIfNeeded(delta);
    if (this.healthBar.getWidth() <= 0) {
      GameService.kickCurrentUser();
    }
  }

  private handleKeyPress = (event?: ex.Input.KeyEvent) => {
    const direction = InteractionPlayer.getDirections(
      (event && event.key) || ex.Input.Keys.Semicolon
    );
    this.direction.addEqual(direction);
  };

  private handleKeyRelease = (event?: ex.Input.KeyEvent) => {
    const direction = InteractionPlayer.getDirections(
      (event && event.key) || ex.Input.Keys.Semicolon
    );
    this.direction.subEqual(direction);
  };

  private sendDataIfNeeded(delta: number) {
    this.sendingDelta += delta;
    if (this.sendingDelta > 15) {
      if (!this.lastSentPosition.sub(this.pos).equals(ex.Vector.Zero)) {
        GameService.move(GameService.getCurrentUser()!.user.id, this.pos);
      }
      if (this.gunFire && this.aim) {
        GameService.fire(GameService.getCurrentUser()!.user.id, this.aim.pos);
      }
      this.sendingDelta = 0;
    }
  }
}
