import { Actor } from "excalibur";

interface IActions {
  move: () => void;
  attack: () => void;
}

interface IPosition {
  x: number;
  y: number;
}

export interface IPlayer extends IGameObject {
  scores: number;
}

export interface IFowl extends IGameObject { }
export interface IShit extends IGameObject { }

export interface IGameObject {
  id: string;
  position: IPosition;
  type: GameObjectType;
}

export enum GameObjectType {
  Player,
  Fowl,
  Shit
}

export interface IUser {
  user: IGameObject;
  actor: Actor;
}
