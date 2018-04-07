import {
  Engine,
  Scene,
  Actor,
  Color,
  TileMap,
  SpriteSheet,
  TileSprite,
  UIActor,
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

    const healthLine = new UIActor(30, 30, 0, 32);
    const currentHealth = new UIActor(30, 30, 0, 32);
    healthLine.color = Color.Orange;
    currentHealth.color = Color.Red;
    currentHealth.setWidth(500);
    healthLine.setWidth(600);
    this.add(healthLine);
    this.add(currentHealth);

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

    const joinPlayer = (player: IPlayer) => {
      if (!GameService.userInGame(player.id)) {
        const actor = new Player(player.position.x, player.position.y);
        this.add(actor);
        GameService.saveOtherPlayer({
          user: player,
          actor
        });
      }
    };

    const joinFowl = (fowl: IPlayer) => {
      if (!GameService.fowlInGame(fowl.id)) {
        const actor = new Fowl(fowl.position.x, fowl.position.y);
        this.add(actor);
        GameService.addFowl({
          user: fowl,
          actor
        });
      }
    };

    GameService.connection.on("playerJoin", (player: IPlayer) =>
      joinPlayer(player)
    );
    GameService.connection.on("players", (players: IPlayer[]) =>
      players.forEach(joinPlayer)
    );

    GameService.connection.on("fowlJoin", (fowl: IPlayer) => joinFowl(fowl));
    GameService.connection.on("fowls", (fowls: IPlayer[]) =>
      fowls.forEach(joinFowl)
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
      (info: IPlayer, vector: { x: number; y: number }) => {
        const player = GameService.getActor(info.id) as Player;
        if (player) {
          player.setFireTarget = new Vector(vector.x, vector.y);
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

    GameService.connection.on("fowlKill", (fowl: string) => {
      const actor = GameService.getActor(fowl);
      if (actor) {
        actor.kill();
        GameService.removeFowl(fowl);
      }
    });

    GameService.connection.on("fowlState", (fowl: IPlayer) => {
      const actor = GameService.getActor(fowl.id);
      console.log(actor);
      if (actor) {
        actor.pos = new Vector(fowl.position.x, fowl.position.y);
      }
    });
  }
}
