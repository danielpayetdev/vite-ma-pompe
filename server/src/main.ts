import { Hono, hourly, serve, Bootstrapped, bootstrap, log } from "./deps.ts";
import { configureLogger } from "./log.ts";
import { AppRouter } from "./routes/app-router.ts";
import { Database } from "./services/database.ts";

/**
 * Main is the entry point of the application.
 */
@Bootstrapped()
export class Main {
  private app: Hono;

  constructor(public router: AppRouter, public database: Database) {
    this.app = new Hono();
    this.router.initialiserRoute(this.app);
  }

  public async startApp(): Promise<void> {
    log.getLogger().info("Starting server...");

    if (await this.database.isDataBaseOutdated()) {
      const worker = this.startWorker();
      if (!this.database.isCacheValid()) {
        await worker;
      }
    }
    hourly(() => this.startWorker());

    const port = +(Deno.env.get("PORT") ?? 3000);
    return serve(this.app.fetch, {
      port,
      onListen: (params: { hostname: string; port: number }) => log.getLogger().info(`Server started on http://${params.hostname === "0.0.0.0" ? "localhost" : params.hostname}:${params.port}`),
    });
  }

  private startWorker(): Promise<void> {
    return new Promise((resolve) => {
      const w = new Worker(new URL("download-worker.ts", import.meta.url).href, {
        type: "module",
      });
      w.onmessage = (event) => {
        if (event.data) {
          this.database.saveStations(event.data).then(() => resolve());
        } else {
          log.getLogger().critical("No data received from worker. Can't update database.");
        }
      };
    });
  }
}

await configureLogger('main');

bootstrap(Main).startApp();
