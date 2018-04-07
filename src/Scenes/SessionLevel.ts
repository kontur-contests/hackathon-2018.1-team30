import {Engine, Scene, Actor, Color} from "excalibur";
import Player from "../Chars/Player";
import SimpleFowl from "../Chars/Fowls/SimpleFowl";

export class SessionLevel extends Scene {
    public onInitialize(engine: Engine) {
        const player = new Player(0, 0);
        const fowl = new SimpleFowl(100, 100);

        this.camera.strategy.elasticToActor(player, 0.3, 0.9);
        this.add(player);
        this.add(fowl);
    }
}
