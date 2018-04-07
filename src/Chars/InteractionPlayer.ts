import { CollisionType, Engine, Input, Vector } from 'excalibur';
import spriteSheet from '../SpriteSheets/DudeNudeSpriteSheet';
import DirectionActor from './DirectionActor';
import { GunFire } from './GunFire';
import { GameService } from '../GameService';
import { Aim } from './Aim';

export default class InteractionPlayer extends DirectionActor {
  private static readonly speed = 5;

  private static getDirections = (key: Input.Keys) => {
    switch (key) {
      case Input.Keys.A:
        return Vector.Left;
      case Input.Keys.W:
        return Vector.Up;
      case Input.Keys.D:
        return Vector.Right;
      case Input.Keys.S:
        return Vector.Down;
      default:
        return Vector.Zero;
    }
  };

  private gunFire: GunFire | null = null;
  private aim: Aim | null = null;

  constructor(x: number, y: number) {
    super(x, y, spriteSheet.width, spriteSheet.height);
    this.collisionType = CollisionType.Passive;
  }

  public onInitialize(engine: Engine) {
    super.onInitialize(engine);
    this.gunFire = new GunFire();
    this.aim = new Aim();
    this.add(this.gunFire);
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
        up: spriteSheet.walk.up(engine, 150),
        up_right: spriteSheet.walk.up(engine, 150),
        up_left: spriteSheet.walk.up(engine, 150),
        down: spriteSheet.walk.down(engine, 150),
        down_right: spriteSheet.walk.down(engine, 150),
        down_left: spriteSheet.walk.down(engine, 150),
        right: spriteSheet.walk.right(engine, 150),
        left: spriteSheet.walk.left(engine, 150)
      }
    });
    engine.input.keyboard.on('press', this.handleKeyPress);
    engine.input.keyboard.on('release', this.handleKeyRelease);

    engine.input.pointers.primary.on('down', () => {
      this.gunFire != null && (this.gunFire.isEnabled = true);
    });
    engine.input.pointers.primary.on('up', () => {
      this.gunFire != null && (this.gunFire.isEnabled = false);
    });
  }

  private sendingDelta: number = 0;
  private lastSentPosition: Vector = Vector.Zero;

  public update(engine: Engine, delta: number) {
    super.update(engine, delta);
    const mousePos = engine.input.pointers.primary.lastScreenPos;
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
  }

  private handleKeyPress = (event?: Input.KeyEvent) => {
    const direction = InteractionPlayer.getDirections((event && event.key) || Input.Keys.Semicolon);
    this.direction.addEqual(direction);
  };

  private handleKeyRelease = (event?: Input.KeyEvent) => {
    const direction = InteractionPlayer.getDirections((event && event.key) || Input.Keys.Semicolon);
    this.direction.subEqual(direction);
  };

  private sendDataIfNeeded(delta: number) {
    this.sendingDelta += delta;
    if (this.sendingDelta > 15) {
      if (!this.lastSentPosition.sub(this.pos).equals(Vector.Zero)) {
        GameService.move(0, this.pos);
      }
      if (this.gunFire && this.aim && this.gunFire.isEnabled) {
        console.log("lol");
        GameService.fire(this.aim.pos);
      }
      this.sendingDelta = 0;
    }
  }
}
