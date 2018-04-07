import signalR = require("@aspnet/signalr");
import { IPlayer } from "../models/Player";

const url = 'http://10.33.94.6:4844/game';

const connection = new signalR.HubConnection(url)
const me: IPlayer | null = null;
const players: IPlayer[] = [];

connection.start();

connection.onclose(() => {
    console.log("Пичаль");
    // connection.start();
});

export class GameConnections {

    public static savePlayer(player: IPlayer) {
        player = player;
    }

    static get me(): IPlayer | null {
        return me;
    }

    static get players(): IPlayer[] {
        return players;
    }

    public static join(): void {
        connection.invoke('join')
            .catch(c => console.log('catch: ', c));
    }

    static get connection(): signalR.HubConnection {
        return connection;
    }
}
