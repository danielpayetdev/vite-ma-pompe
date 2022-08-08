import { Database } from "./database.ts";
import { Context, Hono, hourly, serve } from "./deps.ts";
import { DownloadData } from "./download-data.ts";
import { FuelPrice } from "./fuel-price.ts";
import { TypeCarburant } from "./type/type-carburant.ts";

const app = new Hono();
const database = new Database();
const fuelPrice = new FuelPrice(database);

console.log("Starting server...");

if(await database.isDataBaseOutdated()) {
  database.saveStations(await new DownloadData().download());
}

hourly(() => {
  const w = new Worker(new URL("download-worker.ts", import.meta.url).href, { type: "module" });
  w.onmessage = (event) => {
    database.saveStations(event.data);
  };
  w.postMessage({});
});

app.get("/stations/:id/carburant/:typeCarburant/prix", async (c: Context) => {
  const id = +c.req.param("id");
  const typeCarburant: TypeCarburant = +c.req.param("typeCarburant");
  const prix = await fuelPrice.getPrice(id, typeCarburant);
  return prix ? c.json(prix) : c.notFound();
});

const port = +(Deno.env.get("PORT") ?? 3000);

serve(app.fetch, { port });
