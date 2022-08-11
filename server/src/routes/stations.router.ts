import { Context, Hono, Injectable } from "../deps.ts";
import { TypeCarburant } from "../type/type-carburant.ts";
import { StationService } from "../services/station.service.ts";

@Injectable()
export class StationRouter {

  constructor(
    private stationService: StationService
  ) {}

  getRoutes(): Hono {
    const station = new Hono();
    station.get("/:id/carburant/:typeCarburant/prix", async (c: Context) => {
      const id = +c.req.param("id");
      const typeCarburant: TypeCarburant = +c.req.param("typeCarburant");
      const prix = await this.stationService.getPrice(id, typeCarburant);
      return prix ? c.json({ prix }) : c.notFound();
    });

    station.get("", async (c: Context) => {
      const latitude = +c.req.query("lat");
      const longitude = +c.req.query("long");
      const rayon = +c.req.query("r");
      const limit = +c.req.query("limit");
      const stations = await this.stationService.aroundPosition(latitude, longitude, rayon, limit);
      return stations ? c.json({ stations }) : c.notFound();
    });

    return station;
  }
}
