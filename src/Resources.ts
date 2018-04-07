import { ILoadable, Texture, Resource } from "excalibur";
import TiledResource from "@excaliburjs/excalibur-tiled";

declare const process: any;

const prefix = process.env.PUBLIC_PATH || "";

export class Resources {
  public static Audi = new Texture(prefix + "/assets/sprites/audi.png");
  public static Chickens = new Texture(prefix + "/assets/sprites/chickens.png");
  public static DudeNude = new Texture(
    prefix + "/assets/sprites/dude_nude.png"
  );
  public static Level1 = new TiledResource(prefix + "/assets/levels/1.json");
  public static Aim = new Texture(prefix + "/assets/sprites/aim.png");
  // public static GroundTiles = new Texture("/assets/ground_tiles.png");

  public static values(): ILoadable[] {
    return Object.values(Resources);
  }
}
