import * as ex from "excalibur";
import spriteSheetFactory from "../SpriteSheets/SlawwanSpriteSheet";
import DirectionActor from "./DirectionActor";
import LaserSable from "./LaserSable";
import { GameService } from "../GameService";
import { Aim } from "./Aim";
import Swabra from "./Swabra";
import { GUI } from "../GUI";
import Weapon from "./Weapon";
import ScoreFly from "./ScoreFly";
import Sword1 from "./Sword1";
import Sword2 from "./Sword2";
import Extern from "./Extern";

const spriteSheet = spriteSheetFactory();

export default class InteractionPlayer extends DirectionActor {
  private speed = 7;

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

  private laserSable: LaserSable | null = null;
  private swabra: Swabra | null = null;
  private sword1: Sword1 | null = null;
  private sword2: Sword2 | null = null;
  private extern: Extern | null = null;

  private aim: Aim | null = null;
  private stanTime: number = 0;

  public score: number = 0;
  public stanLable: ex.Label | null = null;

  constructor(x: number, y: number) {
    super(x, y, spriteSheet.width, spriteSheet.height);
    this.collisionType = ex.CollisionType.Active;
    const area = new ex.Actor(x, y, 20, 60).collisionArea;
    area.body = this.body;
    this.collisionArea = area;
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
    engine.input.pointers.primary.on("down", () => {
      if (this.level == 1 && this.swabra == null) {
        this.swabra = new Swabra(() => this.pos);
        engine.currentScene.add(this.swabra);
      }

      if (this.level == 2 && this.laserSable == null) {
        this.laserSable = new LaserSable(() => this.pos);
        engine.currentScene.add(this.laserSable);
      }
      if (this.level == 3 && this.sword1 == null) {
        this.sword1 = new Sword1(() => this.pos);
        engine.currentScene.add(this.sword1);
      }
      if (this.level == 4 && this.sword2 == null) {
        this.sword2 = new Sword2(() => this.pos);
        engine.currentScene.add(this.sword2);
      }
      if (this.level == 5 && this.extern == null) {
        this.extern = new Extern(() => this.pos);
        engine.currentScene.add(this.extern);
      }
    });

    engine.input.pointers.primary.on("up", () => {
      if (this.laserSable != null) {
        this.laserSable.kill();
        this.laserSable = null;
      }
      if (this.swabra != null) {
        this.swabra.kill();
        this.swabra = null;
      }
      if (this.sword1 != null) {
        this.sword1.kill();
        this.sword1 = null;
      }
      if (this.sword2 != null) {
        this.sword2.kill();
        this.sword2 = null;
      }
      if (this.extern != null) {
        this.extern.kill();
        this.extern = null;
      }
    });

    this.on("postcollision", (event?: ex.PostCollisionEvent) => {
      if (event && event.other instanceof Weapon) {
        engine.currentScene.add(
          new ScoreFly(event.actor.x, event.actor.y, -100)
        );
        engine.currentScene.add(
          new ScoreFly(event.other.x, event.other.y, 100)
        );
        if (event.other instanceof LaserSable) {
          this.stanTime = 3000;
        } else if (event.other instanceof Swabra) {
          this.stanTime = 1000;
        }
      }
    });
  }

  private sendingDelta: number = 0;
  private lastSentPosition: ex.Vector = ex.Vector.Zero;

  private level: number = 5;

  public update(engine: ex.Engine, delta: number) {
    super.update(engine, delta);
    if (this.score >= 100 && this.level < 1) {
      GUI.showNotification("You have received SWABRA");
      this.level = 1;
      this.speed += 1;
      setInterval(GUI.hideNotification, 7000);
    }
    if (this.score >= 500 && this.level < 2) {
      GUI.showNotification("You have received LASER!!!");
      this.level = 2;
      this.speed += 1;
      setInterval(GUI.hideNotification, 7000);
    }
    if (this.score >= 1000 && this.level < 3) {
      GUI.showNotification("You have received SWORD1!!!");
      this.level = 3;
      this.speed += 2;
      setInterval(GUI.hideNotification, 7000);
    }
    if (this.score >= 2000 && this.level < 4) {
      GUI.showNotification("You have received SWORD2!!!");
      this.level = 4;
      this.speed += 2;
      setInterval(GUI.hideNotification, 7000);
    }
    if (this.score >= 7000 && this.level < 5) {
      GUI.showNotification("This is KONTUR EXTERN!!!");
      this.level = 5;
      this.speed += 5;
      setInterval(GUI.hideNotification, 7000);
    }

    if (this.stanTime != 0) {
      this.stanTime -= delta;
      if (this.stanLable == null) {
        this.stanLable = new ex.Label("STAN", this.x, this.y + 100);
        engine.currentScene.add(this.stanLable);
      }
    } else {
      if (this.stanLable) {
        engine.currentScene.remove(this.stanLable);
        this.stanLable = null;
      }
    }

    const mousePos = engine.input.pointers.primary.lastWorldPos;
    if (!mousePos) {
      return;
    }
    if (this.aim) {
      this.aim.target = mousePos;
      if (this.laserSable) {
        this.laserSable.target = this.aim.pos;
      } else if (this.swabra) {
        this.swabra.target = this.aim.pos;
      } else if (this.sword1) {
        this.sword1.target = this.aim.pos;
      } else if (this.sword2) {
        this.sword2.target = this.aim.pos;
      } else if (this.extern) {
        this.extern.target = this.aim.pos;
      }
    }

    this.pos.addEqual(this.direction.scale(this.speed));
    this.sendDataIfNeeded(delta);
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
      if (this.laserSable && this.aim) {
        GameService.fire(GameService.getCurrentUser()!.user.id, this.aim.pos);
      }
      this.sendingDelta = 0;
    }
  }
}
