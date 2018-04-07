import { Loader } from "excalibur";
import { Game } from "./Game";
import { Resources } from "./Resources";

const game = new Game();

const loader = new Loader();
loader.addResources(Resources.values());

game.start(loader);
