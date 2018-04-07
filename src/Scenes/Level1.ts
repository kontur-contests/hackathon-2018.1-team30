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
import { GameService } from "../GameService";
import { IPlayer } from "../models/Player";
import InteractionPlayer from "../Chars/InteractionPlayer";

export class Level1 extends Scene {
  public onInitialize(engine: Engine) {
    const tileMap: TileMap = Resources.Level1.getTileMap();
    const tileMapSize = new Vector(
      tileMap.cellWidth * tileMap.cols,
      tileMap.cellHeight * tileMap.rows
    );
    this.add(tileMap);

    GameService.connection.on("playerJoin", (user: IPlayer) => {
      if (user) {
        const interationPlayer = new InteractionPlayer(
          user.position.x,
          user.position.y
        );
        GameService.saveUser({
          user,
          actor: interationPlayer
        });
        this.add(interationPlayer);
        this.camera.addStrategy(
          new SuperCamera(interationPlayer, tileMapSize, 0.3, 0.9)
        );
      }
    });

    GameService.connection.on("players", (players: IPlayer[]) => {
      const otherPlayers = players.filter(
        p => GameService.currentUser && p.id !== GameService.currentUser.user.id
      );
      otherPlayers.forEach(user => {
        if (!GameService.userInGame(user.id)) {
          const actor = new Player(user.position.x, user.position.y);
          this.add(actor);
          GameService.saveOtherPlayer({
            user,
            actor
          });
        }
      });
    });

    GameService.connection.on("playerState", (player: IPlayer) => {
      const actor = GameService.getActor(player.id);
      if (actor) {
        actor.pos = new Vector(player.position.x, player.position.y);
      }
    });

    GameService.connection.on("playerStateNumber", (num: number) => {
      // console.log(num);
      // const actor = GameService.getActor(player.id);
      // if (actor) {
      //     actor.actions.moveTo(player.position.x, player.position.y, 1000);
      // }
    });

    GameService.connection.on(
      "playerAttack",
      (player: IPlayer, vector: { x: number; y: number }) => {
        const actor = GameService.getActor(player.id) as Player;
        if (actor) {
          if (actor.gunFire.timeout) {
            clearTimeout(actor.gunFire.timeout);
            actor.gunFire.timeout = null;
          }
          actor.gunFire.activate(new Vector(vector.x, vector.y));

          actor.gunFire.timeout = setTimeout(() => {
            actor.gunFire.deactivate();
          }, 100);
        }
      }
    );

    GameService.connection.on("playerLeave", (player: IPlayer) => {
      const actor = GameService.getActor(player.id);
      if (actor) {
        actor.kill();
      }
      GameService.kickUser(player);
    });
  }
}
