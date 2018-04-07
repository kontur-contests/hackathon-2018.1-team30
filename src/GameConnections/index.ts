import signalR = require('@aspnet/signalr');
import { IPlayer, Directions, IUser } from '../models/Player';

const url = 'http://10.33.94.6:4844/game';

const connection = new signalR.HubConnection(url);
let currentUser: IUser | null = null;
let otherPlayers: Set<IUser> = new Set([]);

connection.onclose(() => {
  console.log('Пичаль');
  // connection.start();
});

export class GameConnections {

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

  static get otherPlayers(): IUser[] {
    return Array.from(otherPlayers);
  }

  public static join(): void {
    connection.invoke('join').catch(c => console.log('catch: ', c));
  }

  static get connection(): signalR.HubConnection {
    return connection;
  }

  public static move(direction: Directions): void {
    connection.invoke('movePlayer', direction);
  }
}
