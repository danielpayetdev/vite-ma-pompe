import { Hono } from "hono";
import { DownloadData } from "./download-data";
import { FuelPrice } from "./fuel-price";
import { TypeCarburant } from "./type/type-carburant";



const app = new Hono();

const port = parseInt(process.env.PORT) || 3000;

const d = new DownloadData().download();
const fuelPrice = new FuelPrice();

const home = app.get("/", (context) => context.json(fuelPrice.getStation("57000022", TypeCarburant.E85)));

console.log(`Running at http://localhost:${port}`);

export default {
  port,
  fetch: home.fetch,
};
