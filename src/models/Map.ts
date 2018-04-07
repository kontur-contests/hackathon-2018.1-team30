interface IMap {
    width: number;
    height: number;
    tiles: Tile[];
    junks: Junk[];
}

enum Tile {
    Empty,
    Ground
}

enum Junk {
    None,
    Stone
}