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
import { IPlayer, IGameObject, GameObjectType } from "../models/Player";
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
      const interactionPlayer = new InteractionPlayer(
        user.position.x,
        user.position.y
      );
      GameService.saveUser({
        user,
        actor: interactionPlayer
      });
      this.add(interactionPlayer);
      this.camera.addStrategy(
        new SuperCamera(interactionPlayer, tileMapSize, 0.3, 0.9)
      );
    });

    const joinPlayer = (player: IGameObject) => {
      if (player && player.type === GameObjectType.Player && !GameService.userInGame(player.id!)) {
        const actor = new Player(player.position.x, player.position.y);
        this.add(actor);
        GameService.saveOtherPlayer({
          user: player,
          actor
        });
      }
      if (player && player.type === GameObjectType.Fowl && !GameService.fowlInGame(player.id)) {
        const actor = new Fowl(player.position.x, player.position.y);
        this.add(actor);
        GameService.addFowl({
          user: player,
          actor
        });
      }
    };

    GameService.connection.on('gameObjectJoin', (player: IGameObject) => joinPlayer(player));
    GameService.connection.on('gameObjects', (players: IGameObject[]) => players.forEach(joinPlayer));

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

    GameService.connection.on('gameObjectAttack', (info: IGameObject, vector: { x: number; y: number }) => {
      const player = GameService.getActor(info.id) as Player;
      if (player) {
        player.setFireTarget = new Vector(vector.x, vector.y);
      }
    });

    GameService.connection.on("playerLeave", (player: IPlayer) => {
      const actor = GameService.getActor(player.id);
      if (actor) {
        actor.kill();
      }
      GameService.kickUser(player);
    });

    GameService.connection.on("fowlKill", (fowl: IPlayer) => {
      const actor = GameService.getActor(fowl.id);
      if (actor) {
        actor.kill();
      }
    });
  }
}
