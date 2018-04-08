import * as signalR from "@aspnet/signalr";
import { IPlayer, IUser, IGameObject, IFowl } from "../models/Player";
import { Actor } from "Actor";
import { Vector } from "Algebra";
import InteractionPlayer from "../Chars/InteractionPlayer";
import ChickenFowl from "../Chars/Fowl";
import PoopFowl from "../Chars/PoopFowl";

const url = "http://10.33.94.6:4844/game";

const connection = new signalR.HubConnection(url);

export interface IOtherUser {
  [id: string]: IUser;
}

connection.onclose(() => {
  console.log("Пичаль");
});

export class GameService {
  static scores: { gameObjectId: string; scores: number }[] = [];
  static storeScores(scores: { gameObjectId: string; scores: number }[]): any {
    this.scores = scores;
  }
  static countPlayers(): any {
    return Object.keys(this.otherUsers).length + 2;
  }
  private static currentUser: IUser | null = null;
  private static otherUsers: IOtherUser = {};
  private static fowls: IOtherUser = {};

  public static get connection(): signalR.HubConnection {
    return connection;
  }

  public static start() {
    connection.start().then(() => GameService.joinGame());
  }

  public static getCurrentUser(): IUser | null {
    return GameService.currentUser;
  }

  public static saveUser(user: IUser) {
    GameService.currentUser = user;
  }

  public static saveFowl(fowl: IUser): void {
    GameService.fowls[fowl.user.id] = fowl;
  }

  public static saveOtherPlayer(otherPlayer: IUser) {
    GameService.otherUsers[otherPlayer.user.id] = otherPlayer;
  }

  public static getUserById(id: string): IGameObject | null {
    if (GameService.currentUser && GameService.currentUser.user.id === id) {
      return GameService.currentUser.user;
    }
    const otherUser = GameService.otherUsers[id];
    if (otherUser) {
      return otherUser.user;
    }
    const fowl = GameService.fowls[id];
    if (fowl) {
      return fowl.user;
    }

    return null;
  }

  public static getActor(id: string): Actor | null {
    if (GameService.currentUser && GameService.currentUser.user.id === id) {
      return GameService.currentUser.actor;
    }
    const user = GameService.otherUsers[id];
    if (user) {
      return user.actor;
    }
    const fowl = GameService.fowls[id];
    if (fowl) {
      return fowl.actor;
    }

    return null;
  }

  public static userInGame(id: string): boolean {
    const isCurrentUserInGame =
      GameService.currentUser && GameService.currentUser.user.id === id;
    return isCurrentUserInGame || GameService.otherUsers[id] != null;
  }

  public static fowlInGame(id: string): boolean {
    return !!GameService.fowls[id];
  }

  public static fire(id: string, vector: Vector) {
    connection.invoke("attackGameObject", id, vector);
  }

  public static move(id: string, nextPosition: Vector): void {
    connection.invoke("moveGameObject", id, nextPosition);
  }

  public static kickUser(player: IGameObject): void {
    if (GameService.otherUsers && player) {
      delete GameService.otherUsers[player.id];
    }
    if (GameService.fowlInGame && player) {
      delete GameService.fowls[player.id];
    }
  }

  public static kickCurrentUser(): void {
    const currentUser = GameService.getCurrentUser();
    const actor = currentUser!.actor;
    if (actor) {
      actor.kill();
    }
  }

  public static killFowl(fowl: Actor): void {
    if (GameService.fowls && fowl) {
      const object = Object.keys(GameService.fowls)
        .map(x => GameService.fowls[x])
        .find(x => x.actor === fowl);

      if (object) {
        connection.invoke(
          "killGameObject",
          this.currentUser!.user.id,
          object.user.id
        );
      }
    }
  }

  public static removeFowl(fowlId: string) {
    delete GameService.fowls[fowlId];
  }

  public static joinGame(): void {
    connection.invoke("joinGame");
  }
}
