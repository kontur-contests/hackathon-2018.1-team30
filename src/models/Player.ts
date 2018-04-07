import { Actor } from "excalibur";

interface IActions {
  move: () => void;
  attack: () => void;
}

interface IPosition {
  x: number;
  y: number;
}

export interface IPlayer {
  id: string;
  position: IPosition;
}

export interface IUser {
  user: IPlayer;
  actor: Actor;
}
