import { ILoadable, Texture } from "excalibur";

export class Resources {
  public static Audi = new Texture("/assets/sprites/audi.png");
  public static DudeNude = new Texture("/assets/sprites/dude_nude.png");

  public static values(): ILoadable[] {
    return Object.values(Resources)
  }
}
