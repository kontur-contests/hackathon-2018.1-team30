import {Engine, Actor, Vector, Animation, Sprite, IDrawable} from 'excalibur';
import {Color} from "Drawing/Color";

export interface IDirectionDraw {
    [key: string]: IDrawable,

    up: IDrawable,
    down: IDrawable,
    left: IDrawable,
    right: IDrawable,
    up_left: IDrawable,
    up_right: IDrawable,
    down_left: IDrawable,
    down_right: IDrawable
}

export interface IDrawState {
    [key: string]: IDirectionDraw,

    idle: IDirectionDraw,
    walk: IDirectionDraw
}

type Direction = keyof IDirectionDraw;
type State = keyof IDrawState;

export default abstract class DirectionActor extends Actor {
    protected direction: Vector = Vector.Zero.clone();
    private drawDirection: Direction = "down";
    private drawState: State = "idle";

    public update(engine: Engine, delta: number) {
        super.update(engine, delta);
        this.updateDirection();
    }

    protected registerDrawing(states: IDrawState) {
        for (const state in states) {
            const drawingDirections = states[state];
            for (const direction in drawingDirections) {
                const drawingDirection = drawingDirections[direction];
                this.addDrawing(`${state}_${direction}`, drawingDirection);
            }
        }
    }

    protected updateDirection() {
        if (this.direction.equals(Vector.Zero)) {
            this.drawState = "idle";
        } else {
            this.drawState = "walk";
            this.drawDirection = DirectionActor.getDrawDirection(this.direction);
        }
        this.updateDrawState();
    }

    protected updateDrawState = () => {
        this.setDrawing(`${this.drawState}_${this.drawDirection}`)
    };

    private static getDrawDirection(vector: Vector): Direction {
        if (vector.y < 0) {
            if (vector.x === 0) {
                return "up";
            } else if (vector.x > 0) {
                return "up_right";
            } else {
                return "up_left";
            }
        } else if (vector.y > 0) {
            if (vector.x === 0) {
                return "down";
            } else if (vector.x > 0) {
                return "down_right";
            } else {
                return "down_left";
            }
        } else {
            if (vector.x === 0) {
                //TODO (byTimo) наверно плохо так делать
                return "down";
            } else if (vector.x > 0) {
                return "right";
            } else {
                return "left";
            }
        }
    }
}
