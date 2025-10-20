/*
  Framework-agnostic HTTP primitives used by controllers and routes.
  Replace Router/Handler with adapters when we pick Fastify/Hono.
*/

export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export interface HttpRequest<TBody = unknown, TQuery = Record<string, string>, TParams = Record<string, string>> {
  body: TBody;
  query: TQuery;
  params: TParams;
  headers: Record<string, string | undefined>;
  user?: { id: string; role?: string };
}

export interface HttpResponse<T = unknown> {
  status: number;
  headers?: Record<string, string>;
  body?: T;
}

export type Handler<TReq, TRes> = (req: TReq) => Promise<TRes>;

export interface Router {
  route: (method: HttpMethod, path: string, handler: (req: HttpRequest) => Promise<HttpResponse>) => void;
}

export type RouteRegistrar = (router: Router) => void;
