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

    GameConnections.connection.on("playerJoin", (user: IPlayer) => {
      console.log(user);
      if (user) {
        const actor = new Player(user.position.x, user.position.y);
        GameConnections.saveUser({
          user,
          actor
        })
        this.add(actor);
        this.camera.addStrategy(
          new SuperCamera(actor, tileMapSize, 0.3, 0.9)
        );
      }
    });

    GameConnections.connection.on('players', (players: IPlayer[]) => {
      console.log(players);
      const otherPlayers = players.filter(p => GameConnections.currentUser && p.id !== GameConnections.currentUser.user.id)
      otherPlayers.forEach(user => {
        const playerInGame = GameConnections.otherPlayers.some(p => p.user.id === user.id);
        if (!playerInGame) {
          const actor = new Player(user.position.x, user.position.y);
          this.add(actor);
          GameConnections.saveOtherPlayer({
            user,
            actor
          })
        }
      });
    });

    GameConnections.connection.on("playerState", (player: IPlayer) => {
      console.log(player);
      const actor = GameConnections.getActor(player.id);
      if (actor) {
        actor.actions.moveTo(player.position.x, player.position.y, 1000);
      }
    });

  }
}
