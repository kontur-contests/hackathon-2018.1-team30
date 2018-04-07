interface IActions {
    move: () => void;
    attack: () => void;
}

interface IPosition {
    x: number,
    y: number;
}

export interface IPlayer {
    id: string;
    name: string;
    position: IPosition;
}

export enum Directions {
    None,
    Up,
    Right,
    Down,
    Left,
    UpRight,
    UpLeft,
    DownRigth,
    DownLeft
}