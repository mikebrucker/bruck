import HttpController from "@/controllers";
import type { UserAlbumUpdateInput } from "@/data/userAlbumSchema";
import type { UserAlbum } from "@/types/userAlbum";

export default class UserAlbumController {
  private static route = "/user-albums";

  public static getUserAlbums(): Promise<Array<UserAlbum>> {
    return HttpController.doGET(this.route, { requireAuth: false });
  }

  public static updateUserAlbum(albumId: string, input: UserAlbumUpdateInput): Promise<UserAlbum> {
    return HttpController.doPATCH(`${this.route}/${albumId}`, input);
  }
}
