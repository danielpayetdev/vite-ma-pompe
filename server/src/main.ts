import { Hono, hourly, serve, Bootstrapped, bootstrap } from "./deps.ts";
import { AppRouter } from "./routes/app-router.ts";
import { Database } from "./services/database.ts";

@Bootstrapped()
export class Main {
  private app: Hono;

  constructor(public router: AppRouter, public database: Database) {
    this.app = new Hono();
    this.router.initialiserRoute(this.app);
  }

  public async startApp(): Promise<void> {
    console.log("Starting server...");

    if (await this.database.isDataBaseOutdated()) {
      const worker = this.startWorker();
      if (!this.database.isCacheValid()) {
        await worker;
      }
    }
    hourly(() => this.startWorker());

    const port = +(Deno.env.get("PORT") ?? 3000);
    return serve(this.app.fetch, { port });
  }

  private startWorker(): Promise<void> {
    return new Promise((resolve) => {
      const w = new Worker(new URL("download-worker.ts", import.meta.url).href, {
        type: "module",
      });
      w.onmessage = (event) => {
        this.database.saveStations(event.data).then(() => resolve());
      };
    });
  }
}

bootstrap(Main).startApp();
