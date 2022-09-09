import { Hono, serve, Bootstrapped, bootstrap, config } from "./deps.ts";
import { AppRouter } from "./routes/app-router.ts";


/**
 * Main is the entry point of the application.
 */
@Bootstrapped()
export class Main {
  private app: Hono;

  constructor(public router: AppRouter) {
    this.app = new Hono();
    this.router.initialiserRoute(this.app);
  }

  public startApp(): Promise<void> {
    console.log("Starting server...");
    config({ export: true });

    const port = +(Deno.env.get("PORT") ?? 3000);
    return serve(this.app.fetch, {
      port,
      onListen: (params: { hostname: string; port: number }) => console.log(`Server started on http://${params.hostname === "0.0.0.0" ? "localhost" : params.hostname}:${params.port}`),
    });
  }
}

bootstrap(Main).startApp();
