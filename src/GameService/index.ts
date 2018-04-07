import * as signalR from "@aspnet/signalr";
import { IPlayer, Directions, IUser } from "../models/Player";
import { Actor } from "Actor";
import { Vector } from "Algebra";

const url = "http://10.33.94.6:4844/game";

const connection = new signalR.HubConnection(url);
let currentUser: IUser | null = null;
let otherPlayers: Set<IUser> = new Set([]);

connection.onclose(() => {
  console.log("Пичаль");
  // connection.start();
});

export class GameService {
  public static start() {
    connection.start();
  }

  public static saveUser(user: IUser) {
    currentUser = user;
  }

  public static saveOtherPlayer(otherPlayer: IUser) {
    otherPlayers.add(otherPlayer);
  }

  static get currentUser(): IUser | null {
    return currentUser;
  }

  static getActor(id: string): Actor | null {
    if (currentUser && currentUser.user.id === id) {
      return currentUser.actor;
    }
    const user = GameService.otherPlayers.find(p => p.user.id === id);
    if (user) {
      return user.actor;
    }

    return null;
  }

  static userInGame(id: string): boolean {
    return GameService.otherPlayers.some(p => p.user.id === id);
  }

  static get otherPlayers(): IUser[] {
    return Array.from(otherPlayers);
  }

  public static join(): void {
    connection.invoke("join").catch(c => console.log("catch: ", c));
  }

  static get connection(): signalR.HubConnection {
    return connection;
  }

  public static move(num: number, nextPosition: Vector): void {
    connection.invoke("movePlayer", num, nextPosition);
  }
}
