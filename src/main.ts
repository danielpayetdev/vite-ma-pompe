import { Context, Hono, serve } from "./deps.ts";
import { DownloadData } from "./download-data.ts";
import { FuelPrice } from './fuel-price.ts'
import { TypeCarburant } from './type/type-carburant.ts'

const app = new Hono()

const fuelPrice = new FuelPrice();

new DownloadData().download();

app.get('/', (c: Context) => c.json(fuelPrice.getStation("57000022", TypeCarburant.E85)))

serve(app.fetch);
