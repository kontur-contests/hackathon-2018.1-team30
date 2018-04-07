import {Actor, CollisionType, Color, Engine, Input, Vector} from 'excalibur';
import spriteSheet from '../SpriteSheets/DudeNudeSpriteSheet';

enum State {
    Idle = "idle",
    Walk = "walk"
}

enum Directions {
    Up = "up",
    Down = "down",
    Left = "left",
    Right = "right"
}

export default class Player extends Actor {

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

    private direction: Vector = Vector.Zero.clone();
    private drawDirection: Directions = Directions.Down;
    private drawState: State = State.Idle;
    
    constructor(x: number, y: number) {
        super(x, y, spriteSheet.width, spriteSheet.height);
        this.collisionType = CollisionType.Passive;
    }
    
    public onInitialize(engine: Engine) {
        super.onInitialize(engine);
        this.addDrawing("idle_down", spriteSheet.idle.down());
        this.addDrawing("idle_up", spriteSheet.idle.up());
        this.addDrawing("idle_left", spriteSheet.idle.left());
        this.addDrawing("idle_right", spriteSheet.idle.right());
        this.addDrawing("walk_left", spriteSheet.walk.left(engine, 150));
        this.addDrawing("walk_up", spriteSheet.walk.up(engine, 150));
        this.addDrawing("walk_right", spriteSheet.walk.right(engine, 150));
        this.addDrawing("walk_down", spriteSheet.walk.down(engine, 150));

        engine.input.keyboard.on("press", this.handleKeyPress);
        engine.input.keyboard.on("release", this.handleKeyRelease);
    }

    public update(engine: Engine, delta: number) {
        super.update(engine, delta);
        if(this.direction.equals(Vector.Zero)){
            this.drawState = State.Idle;
        } else {
            this.drawState = State.Walk;
            if(this.direction.equals(Vector.Right)){
                this.drawDirection = Directions.Right;
            } else if (this.direction.equals(Vector.Left)) {
                this.drawDirection = Directions.Left;
            } else if(this.direction.y < 0){
                this.drawDirection = Directions.Up;
            } else {
                this.drawDirection = Directions.Down;
            }

            this.pos.addEqual(this.direction.scale(Player.speed));
        }
        this.updateDrawState();
    }

    private updateDrawState = () => {
        this.setDrawing(`${this.drawState}_${this.drawDirection}`)
    };
    
    private handleKeyPress = (event?: Input.KeyEvent) => {
        const direction = Player.getDirections(event && event.key || Input.Keys.Semicolon);
        this.direction.addEqual(direction);
    };

    private handleKeyRelease = (event?: Input.KeyEvent) => {
        const direction = Player.getDirections(event && event.key || Input.Keys.Semicolon);
        this.direction.subEqual(direction);
    }
}