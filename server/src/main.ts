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
      this.startWorker();
    }
    hourly(() => this.startWorker());

    const port = +(Deno.env.get("PORT") ?? 3000);
    return serve(this.app.fetch, { port });
  }

  private startWorker() {
    const w = new Worker(new URL("download-worker.ts", import.meta.url).href, {
      type: "module",
    });
    w.onmessage = (event) => {
      this.database.saveStations(event.data);
    };
    w.postMessage({});
  }
}

bootstrap(Main).startApp();
