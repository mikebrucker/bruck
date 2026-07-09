import HttpController from "@/controllers";
import type { AlbumCreateInput, AlbumUpdateInput } from "@/data/albumRepository";
import type { Album } from "@/types/album";

export default class AlbumController {
  private static route = "/albums";

  public static getAlbums(): Promise<Array<Album>> {
    return HttpController.doGET(this.route, { requireAuth: false });
  }

  public static getAlbum(id: string): Promise<Album> {
    return HttpController.doGET(`${this.route}/${id}`, { requireAuth: false });
  }

  public static createAlbum(input: AlbumCreateInput): Promise<Album> {
    return HttpController.doPOST(this.route, input);
  }

  public static updateAlbum(id: string, input: AlbumUpdateInput): Promise<Album> {
    return HttpController.doPATCH(`${this.route}/${id}`, input);
  }

  public static createAlbumRaw(body: AlbumCreateInput): Promise<Album> {
    return HttpController.doPOST(this.route, body);
  }

  public static updateAlbumRaw(id: string, body: AlbumUpdateInput): Promise<Album> {
    return HttpController.doPATCH(`${this.route}/${id}`, body);
  }
}
