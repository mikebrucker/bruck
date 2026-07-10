import HttpController from "@/controllers";
import type { User } from "@/types/user";

export default class UserController {
  private static route = "/user";

  public static getUser(): Promise<User> {
    return HttpController.doGET(this.route, { requireAuth: false });
  }
}
