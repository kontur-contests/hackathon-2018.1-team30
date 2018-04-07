import {
  Engine,
  Scene,
  Actor,
  Color,
  TileMap,
  SpriteSheet,
  TileSprite,
  Vector
} from "excalibur";
import Player from "../Chars/Player";
import { Resources } from "../Resources";
import SuperCamera from "../SuperCamera";
import { Aim } from "../Chars/Aim";
import { GameConnections } from "../GameConnections";
import { IPlayer } from "../models/Player";

export class Level1 extends Scene {
  public onInitialize(engine: Engine) {
    const tileMap: TileMap = Resources.Level1.getTileMap();
    const tileMapSize = new Vector(
      tileMap.cellWidth * tileMap.cols,
      tileMap.cellHeight * tileMap.rows
    );
    this.add(tileMap);

    const audi = new Player(1000, 1000);
    this.camera.addStrategy(new SuperCamera(audi, tileMapSize, 0.3, 0.9));

    audi.add(new Aim());
    this.camera.addStrategy(new SuperCamera(audi, tileMapSize, 0.3, 0.9));
    this.add(new Actor(10, 10, 10, 10, Color.Red));
    this.add(new Actor(-10, 10, 10, 10, Color.Red));
    this.add(new Actor(10, -10, 10, 10, Color.Red));
    this.add(new Actor(-10, -10, 10, 10, Color.Red));
    this.add(audi);

    GameConnections.connection.on("playerJoin", (player: IPlayer) => {
      console.log(player);
      if (player) {
        const x = player.position.x;
        const y = player.position.y;
        const newPlayer = new Player(x, y);
        this.add(newPlayer);
        this.camera.addStrategy(
          new SuperCamera(newPlayer, tileMapSize, 0.3, 0.9)
        );
      }
    });
  }
}
