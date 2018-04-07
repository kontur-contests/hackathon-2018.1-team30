import { ILoadable, Texture, Resource } from "excalibur";
import TiledResource from "@excaliburjs/excalibur-tiled";

export class Resources {
  public static Audi = new Texture("/assets/sprites/audi.png");
  public static DudeNude = new Texture("/assets/sprites/dude_nude.png");
  public static Level1 = new TiledResource("/assets/levels/1.json");
  // public static GroundTiles = new Texture("/assets/ground_tiles.png");

  public static values(): ILoadable[] {
    return Object.values(Resources);
  }
}
