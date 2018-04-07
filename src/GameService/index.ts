import * as signalR from "@aspnet/signalr";
import { IPlayer, IUser } from "../models/Player";
import { Actor } from "Actor";
import { Vector } from "Algebra";
import InteractionPlayer from "../Chars/InteractionPlayer";

const url = "http://10.33.94.6:4844/game";

const connection = new signalR.HubConnection(url);
let interactionPlayer: {
  remoute: IPlayer;
  player: InteractionPlayer;
};

let currentUser: IUser | null = null;
export interface IOtherUser {
  [id: string]: IUser;
}

connection.onclose(() => {
  console.log("Пичаль");
  // connection.start();
});

export class GameService {
  private static otherUsers: IOtherUser = {};

  public static start() {
    connection.start();
  }

  public static saveUser(user: IUser) {
    currentUser = user;
  }

  public static saveOtherPlayer(otherPlayer: IUser) {
    this.otherPlayers[otherPlayer.user.id] = otherPlayer;
  }

  static get currentUser(): IUser | null {
    return currentUser;
  }

  static getActor(id: string): Actor | null {
    if (currentUser && currentUser.user.id === id) {
      return currentUser.actor;
    }
    const user = this.otherPlayers[id];
    if (user) {
      return user.actor;
    }

    return null;
  }

  static userInGame(id: string): boolean {
    return GameService.otherPlayers[id] != null;
  }

  static get otherPlayers(): IOtherUser {
    return GameService.otherUsers;
  }

  public static join(): void {
    connection.invoke("join").catch(c => console.log("catch: ", c));
  }

  static get connection(): signalR.HubConnection {
    return connection;
  }

  public static fire(vector: Vector) {
    connection.invoke("attackPlayer", vector);
  }

  public static move(num: number, nextPosition: Vector): void {
    connection.invoke("movePlayer", num, nextPosition);
  }

  public static kickUser(player: IPlayer): void {
    if (this.otherPlayers && player) {
      delete this.otherPlayers[player.id];
    }
  }
}
