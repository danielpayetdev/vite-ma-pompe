import { serve } from "https://deno.land/std@0.150.0/http/server.ts"
import { Context, Hono } from "https://deno.land/x/hono@v2.0.6/mod.ts"
import { DownloadData } from "./download-data.ts";
import { FuelPrice } from './fuel-price.ts'
import { TypeCarburant } from './type/type-carburant.ts'

const app = new Hono()

const fuelPrice = new FuelPrice();

new DownloadData().download();

app.get('/', (c: Context) => c.json(fuelPrice.getStation("57000022", TypeCarburant.E85)))

serve(app.fetch);
