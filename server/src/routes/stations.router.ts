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

    return station;
  }
}
