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
import {
  IPlayer,
  IGameObject,
  GameObjectType,
  IPosition
} from "../models/Player";
import InteractionPlayer from "../Chars/InteractionPlayer";
import Fowl from "../Chars/Fowl";
import PoopFowl from "../Chars/PoopFowl";

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
      if (
        player &&
        player.type === GameObjectType.Player &&
        !GameService.userInGame(player.id!)
      ) {
        const actor = new Player(player.position.x, player.position.y);
        this.add(actor);
        GameService.saveOtherPlayer({
          user: player,
          actor
        });
      }
      if (
        player &&
        player.type === GameObjectType.Fowl &&
        !GameService.fowlInGame(player.id)
      ) {
        const actor = new Fowl(player.position.x, player.position.y);
        this.add(actor);
        GameService.saveFowl({
          user: player,
          actor
        });
      }
      if (
        player &&
        player.type === GameObjectType.Shit &&
        !GameService.fowlInGame(player.id)
      ) {
        const actor = new PoopFowl(player.position.x, player.position.y);
        this.add(actor);
        GameService.saveFowl({
          user: player,
          actor
        });
      }
    };

    GameService.connection.on("gameObjectsJoin", (players: IGameObject[]) =>
      players.forEach(joinPlayer)
    );
    GameService.connection.on("gameObjects", (players: IGameObject[]) =>
      players.forEach(joinPlayer)
    );

    GameService.connection.on(
      "gameObjectMove",
      (id: string, position: IPosition) => {
        const player = GameService.getActor(id) as Player;
        if (player) {
          player.nextPosition = new Vector(position.x, position.y);
        }
      }
    );

    GameService.connection.on("playerStateNumber", (num: number) => {
      // console.log(num);
      // const actor = GameService.getActor(player.id);
      // if (actor) {
      //     actor.actions.moveTo(player.position.x, player.position.y, 1000);
      // }
    });

    GameService.connection.on(
      "gameObjectAttack",
      (id: string, vector: { x: number; y: number }) => {
        const player = GameService.getActor(id) as Player;
        if (player) {
          player.setFireTarget = new Vector(vector.x, vector.y);
        }
      }
    );

    GameService.connection.on("gameObjectLeave", (id: string) => {
      const actor = GameService.getActor(id);
      if (actor) {
        actor.kill();
      }
      const player = GameService.getUserById(id);
      if (player) {
        GameService.kickUser(player);
      }
    });
  }
}
