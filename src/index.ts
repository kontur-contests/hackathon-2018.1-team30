import { Loader, Sound } from "excalibur";
import { Game } from "./Game";
import { Resources } from "./Resources";
import * as signalR from "@aspnet/signalr";
import { GameService } from "./GameService";
import { GUI } from "./GUI";

const game = new Game();
const gui = GUI.init();
const loader = new Loader();

loader.addResources(Resources.values());

game.start(loader).then(() => {
  console.log("Started");
  Resources.MainTheme.play();
  Resources.MainTheme.setLoop(true);
  GameService.start();
});
