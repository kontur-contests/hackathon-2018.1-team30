import { Actor, Color, Input, Vector } from "excalibur";

const width = 40;
const height = 40;

const ROTATE_SPEED = 1 / 12;
const MOVE_SPEED = 2 * 1e-1;

export class Doggy extends Actor {
  private pressedKeys: { [key: number]: boolean } = {
    [Input.Keys.Up]: false,
    [Input.Keys.Right]: false,
    [Input.Keys.Down]: false,
    [Input.Keys.Left]: false
  };

  private seed: number = 0;

  private interval: number = 0;

  constructor(x: number, y: number) {
    super(x - width / 2, y - height / 2, width, height, Color.Cyan);
  }

  public onInitialize(engine: ex.Engine) {
    engine.input.keyboard.on("press", ev => {
      if (!ev) {
        return;
      }
      if (ev.key in this.pressedKeys) {
        this.pressedKeys[ev.key] = true;
      }
    });

    engine.input.keyboard.on("release", ev => {
      if (!ev) {
        return;
      }
      if (ev.key in this.pressedKeys) {
        this.pressedKeys[ev.key] = false;
      }
    });

    this.interval = setInterval(() => {
      this.seed = Math.round(Math.random() * 10);
    }, 200);
  }

  public update(_: ex.Engine, delta: number) {
    const directionVec = this._getDirectionVec();

    if (directionVec.distance() !== 0) {
      this.rotation = directionVec.toAngle() + Math.PI / 2;
      this.pos = this.pos.add(
        directionVec.normalize().scale(delta * MOVE_SPEED)
      );
    }
  }

  public draw(ctx: CanvasRenderingContext2D, delta: number) {
    ctx.save();
    ctx.translate(this.pos.x - width / 2, this.pos.y - height / 2);
    ctx.rotate(this.rotation);

    this._drawBody(ctx);
    this._drawEars(ctx);
    this._drawEyes(ctx);
    this._drawTail(ctx);

    ctx.restore();
  }

  private _getDirectionVec() {
    const vectors = [];
    if (this.pressedKeys[Input.Keys.Up]) {
      vectors.push(new Vector(0, -1));
    }
    if (this.pressedKeys[Input.Keys.Down]) {
      vectors.push(new Vector(0, 1));
    }
    if (this.pressedKeys[Input.Keys.Right]) {
      vectors.push(new Vector(1, 0));
    }
    if (this.pressedKeys[Input.Keys.Left]) {
      vectors.push(new Vector(-1, 0));
    }
    return vectors.reduce((a, b) => a.add(b), new Vector(0, 0));
  }

  private _drawTail(ctx: CanvasRenderingContext2D) {
    const dx = this.seed / 3 - 1.8;

    ctx.fillStyle = Color.Black.toString();
    ctx.beginPath();
    ctx.arc(dx, height * 9 / 16, width / 6, 0, 2 * Math.PI);
    ctx.closePath();
    ctx.fill();
  }

  private _drawEyes(ctx: CanvasRenderingContext2D) {
    this._drawEye(width / 8, -height * 5 / 8, ctx);
    this._drawEye(-width * 3 / 8, -height * 5 / 8, ctx);
  }

  private _drawEye(x: number, y: number, ctx: CanvasRenderingContext2D) {
    const dx = this.seed % 3 - 0.5;
    ctx.fillStyle = Color.White.toString();
    ctx.beginPath();
    ctx.rect(x - dx, y, width / 4, height / 4);
    ctx.closePath();
    ctx.fill();
  }

  private _drawEars(ctx: CanvasRenderingContext2D) {
    this._drawEar(width / 4, -height * 5 / 16, ctx);
    this._drawEar(-width * 3 / 4, -height * 5 / 16, ctx);
  }

  private _drawEar(x: number, y: number, ctx: CanvasRenderingContext2D) {
    const dx = this.seed % 2 - 0.5;

    ctx.fillStyle = Color.Black.toString();
    ctx.beginPath();
    ctx.rect(dx + x, y, width / 2, height / 2);
    ctx.closePath();
    ctx.fill();
  }

  private _drawBody(ctx: CanvasRenderingContext2D) {
    const dx = this.seed / 10 - 0.5;
    ctx.fillStyle = this.color.toString();
    ctx.beginPath();
    ctx.rect(dx - width / 2, -height / 2, width, height);
    ctx.closePath();
    ctx.fill();
  }
}
