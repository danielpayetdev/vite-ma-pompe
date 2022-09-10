import { bootstrap, Bootstrapped, config, Hono } from "./deps.ts";
import { AppRouter } from "./routes/app-router.ts";

Deno.addSignalListener("SIGTERM", () => {
  console.log("Exiting...");
  Deno.exit();
});

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
    return Deno.serve({
      port,
      onListen({ port, hostname }) {
        console.log(
          `Server started on http://${
            hostname === "0.0.0.0" ? "localhost" : hostname
          }:${port}`,
        );
      },
    }, this.app.fetch);
  }
}

bootstrap(Main).startApp();
