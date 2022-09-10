import { Context, Hono, Injectable } from "../deps.ts";
import { TypeCarburant } from "../common/type/type-carburant.ts";
import { StationService } from "../services/station.service.ts";

/**
 * StationRouter is responsible for the station routes.
 */
@Injectable()
export class StationRouter {
  constructor(private stationService: StationService) {}

  getRoutes(): Hono {
    const station = new Hono();
    station.get("/:id/carburant/:typeCarburant/prix", async (c: Context) => {
      const id = +c.req.param("id");
      const typeCarburant: TypeCarburant = +c.req.param("typeCarburant");
      const prix = await this.stationService.getPrice(id, typeCarburant);
      return prix ? c.json({ prix }) : c.notFound();
    });

    station.get("", async (c: Context) => {
      const { latitude, longitude, rayon, limit, fuel } = c.req.query();
      if (
        latitude === undefined || longitude === undefined || fuel === undefined
      ) {
        return c.body("Fuel, latitude or longitude aren't set.", 400);
      }
      const stations = await this.stationService.aroundPosition(
        +latitude,
        +longitude,
        +rayon,
        +limit,
        +fuel,
      );
      return stations ? c.json({ stations }) : c.notFound();
    });

    return station;
  }
}
