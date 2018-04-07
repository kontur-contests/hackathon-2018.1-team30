import DirectionActor from "../DirectionActor";
import {Engine, Color} from "excalibur";

export default class SimpleFowl extends DirectionActor{
    constructor(x: number, y: number){
        super(x, y, 10, 10, Color.White);
    }

    public onInitialize(engine: Engine ) {

    }
}