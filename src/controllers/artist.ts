import HttpController from "@/controllers";
import type { ArtistCreateInput, ArtistUpdateInput } from "@/data/artistRepository";
import type { Artist } from "@/types/artist";

export default class ArtistController {
  private static route = "/artists";

  public static getArtists(): Promise<Array<Artist>> {
    return HttpController.doGET(this.route, { requireAuth: false });
  }

  public static getArtist(id: string): Promise<Artist> {
    return HttpController.doGET(`${this.route}/${id}`, { requireAuth: false });
  }

  public static createArtist(input: ArtistCreateInput): Promise<Artist> {
    return HttpController.doPOST(this.route, input);
  }

  public static updateArtist(id: string, input: ArtistUpdateInput): Promise<Artist> {
    return HttpController.doPATCH(`${this.route}/${id}`, input);
  }

  public static deleteArtist(id: string): Promise<void> {
    return HttpController.doDELETE(`${this.route}/${id}`);
  }
}
