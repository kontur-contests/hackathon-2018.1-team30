import { Engine, Scene, TileMap, Vector } from "excalibur";
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
import ChickenFowl from "../Chars/ChickenFowl";
import PoopFowl from "../Chars/PoopFowl";
import { GUI } from "../GUI";
import Score from "../Chars/Score";

export class Level1 extends Scene {
  public onInitialize(engine: Engine) {
    GUI.showLoader();
    const tileMap: TileMap = Resources.Level1.getTileMap();
    const tileMapSize = new Vector(
      tileMap.cellWidth * tileMap.cols,
      tileMap.cellHeight * tileMap.rows
    );

    const score = new Score(100, 100, 0);
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
        new SuperCamera(interactionPlayer, tileMapSize, 0.7, 0.8)
      );

      GUI.hideLoader();
      GUI.showWelcome();

      setTimeout(() => {
        GUI.hideWelcome();
        GUI.showScore();
      }, 7500);
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
        GUI.setPlayersCount(GameService.countPlayers());
      }
      if (
        player &&
        player.type === GameObjectType.Fowl &&
        !GameService.fowlInGame(player.id)
      ) {
        const actor = new ChickenFowl(player.position.x, player.position.y);
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

    GameService.connection.on(
      "scores",
      (scores: { gameObjectId: string; scores: number }[]) => {
        const current = GameService.getCurrentUser();
        const gameScore = scores.find(x => x.gameObjectId === current!.user.id);
        (current!.actor as InteractionPlayer).score = gameScore!.scores;
        GameService.storeScores(scores);
        GUI.updateScore(scores);
      }
    );

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
        GUI.setPlayersCount(GameService.countPlayers());
      }
    });

    GameService.connection.on("gameEnd", () => {
      GameService.kickCurrentUser();
    });
  }
}
