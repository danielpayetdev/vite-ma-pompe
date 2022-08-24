import { FindByLocationProcess } from "./find-by-location.ts";
import { StationsRepo } from "../../common/repository/stations.repo.ts";
import { PoolClient } from "./deps.ts";
import { connect } from "../../common/database/database.ts";
import { Station } from "../../common/type/interface/station.ts";

// deno-lint-ignore no-explicit-any
export default async function (req: any, res: any) {
  const { lat, lng, rayon = 10, limit = 50, fuel } = JSON.parse(req.payload);
  if (lat === undefined || lng === undefined || fuel === undefined) {
    res.send("fuel, lat and lng are required", 400)
  }
  try {
    const connection: PoolClient = (await connect(req, res))!;
    const stations = (await connection.queryObject<Station>(StationsRepo.getAllByFuel(fuel))).rows;
    res.json(
      new FindByLocationProcess().aroundPosition(stations, lat, lng, rayon, limit),
    );
    return;
  } catch (e) {
    console.error(e.message);
    res.send("Error while retrieve data: " + e.message, 500);
    return;
  }
}
