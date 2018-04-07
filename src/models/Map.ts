interface IMapDefinition {
    cells: IMapCellDefinition[];
    tileSheets: IMapTileSheet[];
    width: number;
    height: number;
    tileWidth: number;
    tileHeight: number;
}

interface IMapCellDefinition {
    x: number;
    y: number;
    tileId: number;
    sheetId: number;
}

interface IMapTileSheet {
    id: number;
    path: string;
    columns: number;
    rows: number;
}