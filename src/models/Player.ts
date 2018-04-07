interface IActions {
    move: () => void;
    attack: () => void;
}

interface IPosition {
    x: number,
    y: number;
}

export interface IPlayer {
    id: any;
    name: string;
    position: IPosition;
}