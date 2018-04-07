import { DisplayMode, Engine, Loader } from "excalibur";
import { Level1 } from "./Scenes/Level1";
import * as signalR from '@aspnet/signalr';
import { IHubConnectionOptions } from "@aspnet/signalr";

let connection = new signalR.HubConnection('http://10.33.94.6:4844/chat');

connection.on('send', data => {
  console.log(data);
});

connection.start()
  .then(() => connection.invoke('send', 'Дичь', 'Привет')).catch(c => {
    console.log(c)
  });

export class Game extends Engine {
  constructor() {
    super({
      displayMode: DisplayMode.FullScreen,
    });
  }

  public start(loader: Loader) {

    // fetch Map from backen

    this.add("level1", new Level1());

    return super.start(loader).then(() => {
      this.goToScene("level1");
    });
  }
}
