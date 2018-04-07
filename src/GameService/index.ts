import * as signalR from "@aspnet/signalr";
import { IPlayer, IUser, IGameObject, IFowl } from "../models/Player";
import { Actor } from "Actor";
import { Vector } from "Algebra";
import InteractionPlayer from "../Chars/InteractionPlayer";
import Fowl from "../Chars/Fowl";
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
  private static currentUser: IUser | null = null;
  private static otherUsers: IOtherUser = {};
  private static fowls: IOtherUser = {};

  public static get connection(): signalR.HubConnection {
    return connection;
  }

  public static start() {
    connection.start();
  }

  public static getCurrentUser(): IUser | null {
    return this.currentUser;
  }

  public static saveUser(user: IUser) {
    this.currentUser = user;
  }

  public static saveFowl(fowl: IUser): void {
    this.fowls[fowl.user.id] = fowl;
  }

  public static saveOtherPlayer(otherPlayer: IUser) {
    this.otherUsers[otherPlayer.user.id] = otherPlayer;
  }

  public static getActor(id: string): Actor | null {
    if (this.currentUser && this.currentUser.user.id === id) {
      return this.currentUser.actor;
    }
    const user = this.otherUsers[id];
    if (user) {
      return user.actor;
    }
    const fowl = this.fowls[id];
    if (fowl) {
      return fowl.actor;
    }

    return null;
  }

  public static userInGame(id: string): boolean {
    return !!GameService.otherUsers[id];
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

  public static kickUser(player: IPlayer): void {
    if (this.otherUsers && player) {
      delete this.otherUsers[player.id];
    }
  }

  public static killFowl(fowl: Actor): void {
    if (this.fowls && fowl) {
      const object = Object.keys(this.fowls)
        .map(x => this.fowls[x])
        .find(x => x.actor === fowl);
      if (object) {
        connection.invoke("killGameObject", object.user.id);
      }
    }
  }

  public static removeFowl(fowlId: string) {
    delete this.fowls[fowlId];
  }
}
