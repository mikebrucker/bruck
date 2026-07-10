import { useAdminAuthStore } from "@/stores/useAdminAuthStore";

export type HttpOptions = {
  requireAuth: boolean;
  headersInit: HeadersInit;
};

export default class HttpController {
  private static route = "/api";

  public static defaultOptions: HttpOptions = {
    requireAuth: true,
    headersInit: { "Content-Type": "application/json" },
  };

  private static async parseErrorMessage(response: Response): Promise<string> {
    try {
      const data: unknown = await response.json();
      if (typeof data === "object" && data !== null && "error" in data) {
        return String((data as { error: unknown }).error);
      }
    } catch {
      // response body wasn't JSON
    }
    return response.statusText;
  }

  private static authHeaders(headersInit: HeadersInit): HeadersInit {
    const token = useAdminAuthStore.getState().token;
    return token ? { ...headersInit, Authorization: `Bearer ${token}` } : headersInit;
  }

  private static async request<T>(url: string, init: RequestInit): Promise<T> {
    const response = await fetch(url, init);
    if (!response.ok) {
      throw new Error(await HttpController.parseErrorMessage(response));
    }
    const data: T = await response.json();
    return data;
  }

  public static doGET<T>(route: string, options: Partial<HttpOptions> = {}): Promise<T> {
    const { requireAuth, headersInit } = { ...HttpController.defaultOptions, ...options };
    const headers = requireAuth ? HttpController.authHeaders(headersInit) : headersInit;
    return HttpController.request<T>(`${this.route}${route}`, { method: "GET", headers });
  }

  public static doPOST<T, B = unknown>(
    route: string,
    body: B,
    options: Partial<HttpOptions> = {},
  ): Promise<T> {
    const { requireAuth, headersInit } = { ...HttpController.defaultOptions, ...options };
    const headers = requireAuth ? HttpController.authHeaders(headersInit) : headersInit;
    return HttpController.request<T>(`${this.route}${route}`, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });
  }

  public static doPATCH<T, B = unknown>(
    route: string,
    body: B,
    options: Partial<HttpOptions> = {},
  ): Promise<T> {
    const { requireAuth, headersInit } = { ...HttpController.defaultOptions, ...options };
    const headers = requireAuth ? HttpController.authHeaders(headersInit) : headersInit;
    return HttpController.request<T>(`${this.route}${route}`, {
      method: "PATCH",
      headers,
      body: JSON.stringify(body),
    });
  }

  public static async doDELETE(route: string, options: Partial<HttpOptions> = {}): Promise<void> {
    const { requireAuth, headersInit } = { ...HttpController.defaultOptions, ...options };
    const headers = requireAuth ? HttpController.authHeaders(headersInit) : headersInit;
    const response = await fetch(`${this.route}${route}`, { method: "DELETE", headers });
    if (!response.ok) {
      throw new Error(await HttpController.parseErrorMessage(response));
    }
  }
}
