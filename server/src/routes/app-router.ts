import { Hono, Injectable } from "../deps.ts";
import { StationRouter } from "./stations.router.ts";

@Injectable()
export class AppRouter {
  constructor(public stationRouter: StationRouter) {}

  public initialiserRoute(app: Hono) {
    app.route("/stations", this.stationRouter.getRoutes());
  }
}
