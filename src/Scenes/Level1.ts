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
import Fowl from "../Chars/Fowl";

export class Level1 extends Scene {
  public onInitialize(engine: Engine) {
    const tileMap: TileMap = Resources.Level1.getTileMap();
    const tileMapSize = new Vector(
      tileMap.cellWidth * tileMap.cols,
      tileMap.cellHeight * tileMap.rows
    );
    this.add(tileMap);

    GameService.connection.on("me", (user: IPlayer) => {
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
    });

    GameService.connection.on("playerJoin", (player: IPlayer) =>
      this.joinPlayer(player)
    );

    GameService.connection.on("players", (players: IPlayer[]) =>
      players.forEach(this.joinPlayer)
    );

    GameService.connection.on("playerState", (info: IPlayer) => {
      const player = GameService.getActor(info.id) as Player;
      if (player) {
        player.nextPosition = new Vector(info.position.x, info.position.y);
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
          actor.gunFire.target = new Vector(vector.x, vector.y);
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

    GameService.connection.on("fowlJoin", (fowl: IPlayer) => {
      const actor = new Fowl(fowl.position.x, fowl.position.y);
      this.add(actor);
      GameService.addFowl({
        user: fowl,
        actor
      });
    });

    GameService.connection.on("killFowl", (fowl: IPlayer) => {
      const actor = GameService.getActor(fowl.id);
      if (actor) {
        actor.kill();
      }
      GameService.killFowl(fowl);
    });
  }

  private joinPlayer(player: IPlayer): void {
    if (!GameService.userInGame(player.id)) {
      const actor = new Player(player.position.x, player.position.y);
      this.add(actor);
      GameService.saveOtherPlayer({
        user: player,
        actor
      });
    }
  }
}
