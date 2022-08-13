import { Hono, Injectable } from "../deps.ts";
import { StationRouter } from "./stations.router.ts";

/**
 * AppRouter is responsible for the application routes.
 */
@Injectable()
export class AppRouter {
  constructor(public stationRouter: StationRouter) {}

  public initialiserRoute(app: Hono) {
    app.route("/stations", this.stationRouter.getRoutes());
  }
}
