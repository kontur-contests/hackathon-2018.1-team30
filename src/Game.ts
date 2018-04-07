import { DisplayMode, Engine, Loader, Input } from "excalibur";
import { Level1 } from "./Scenes/Level1";
import * as signalR from '@aspnet/signalr';
import { IHubConnectionOptions } from "@aspnet/signalr";
import { IPlayer } from './models/Player';
import {SessionLevel} from "./Scenes/SessionLevel";

const url = 'http://10.33.94.6:4844/game';
const connection = new signalR.HubConnection(url);

connection.on('join', (player: IPlayer) => {
  console.log(player);
});

connection.start()
  .then(() => connection.invoke('join'))
  .catch(c => console.log('catch=', c));

connection.onclose(() => {
  console.log("Пичаль");
  // connection.start();
})

export class Game extends Engine {
  constructor() {
    super({
      displayMode: DisplayMode.FullScreen,
    });
  }

  public start(loader: Loader) {
    this.input.keyboard.on("press", (event?: Input.KeyEvent) => event != null && event.key === Input.Keys.Space && this.goToScene("session"))
    // fetch Map from backen

    this.add("level1", new Level1());
    this.add("session", new SessionLevel());

    return super.start(loader).then(() => {
      this.goToScene("level1");
    });
  }
}
