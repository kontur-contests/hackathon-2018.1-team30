import { Loader, Sound } from "excalibur";
import { Game } from "./Game";
import { Resources } from "./Resources";
import * as signalR from "@aspnet/signalr";
import { GameService } from "./GameService";

var sound = new Sound("/assets/sound.mp3");
const game = new Game();
const loader = new Loader([sound]);

loader.addResources(Resources.values());

game.start(loader).then(() => {
    console.log("Started");
    GameService.start();
});

game.start(loader).then(function () {
    sound.play();
});