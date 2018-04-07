import { Loader } from "excalibur";
import { Game } from "./Game";
import { Resources } from "./Resources";
import * as signalR from "@aspnet/signalr";

const game = new Game();
const loader = new Loader();
loader.addResources(Resources.values());

game.start(loader).then(() => {
    console.log("Started");
});
