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

    // const audi = new Player(1000, 1000);
    // this.camera.addStrategy(new SuperCamera(audi, tileMapSize, 0.3, 0.9));

    // audi.add(new Aim());
    // this.camera.addStrategy(new SuperCamera(audi, tileMapSize, 0.3, 0.9));
    // this.add(new Actor(10, 10, 10, 10, Color.Red));
    // this.add(new Actor(-10, 10, 10, 10, Color.Red));
    // this.add(new Actor(10, -10, 10, 10, Color.Red));
    // this.add(new Actor(-10, -10, 10, 10, Color.Red));
    // this.add(audi);

    GameConnections.connection.on("playerJoin", (player: IPlayer) => {
      console.log(player);
      if (player) {
        const newPlayer = new Player(player.position.x, player.position.y);
        GameConnections.saveUser({
          me: player,
          actor: newPlayer
        })
        this.add(newPlayer);
        this.camera.addStrategy(
          new SuperCamera(newPlayer, tileMapSize, 0.3, 0.9)
        );
      }
    });

    GameConnections.connection.on('players', (players: IPlayer[]) => {
      console.log(players);
      players.forEach(p => {
        const isMe = GameConnections.currentUser && p.id === GameConnections.currentUser.me.id;
        const playerInGame = GameConnections.players.some(p => p.id === p.id);
        if (!isMe && !playerInGame) {
          const newPlayer = new Player(p.position.x, p.position.y);
          this.add(newPlayer);
        }
      });
    });

    GameConnections.connection.on("playerState", (player: IPlayer) => {
      console.log(player);
      if (GameConnections.currentUser) {
        const actor = GameConnections.currentUser.actor;
        actor.actions.moveTo(player.position.x, player.position.y, 100);
      }
    });

  }
}
