import { connect } from "../../common/database/database.ts";
import { StationsRepo } from "../../common/repository/stations.repo.ts";
import { Station } from "../../common/type/interface/station.ts";
import { PoolClient } from "./deps.ts";

// deno-lint-ignore no-explicit-any
export default async function (req: any, res: any) {
  const { station, fuel } = JSON.parse(req.payload);
  if (station === undefined || fuel === undefined) {
    res.send("fuel and station are required", 400)
  }
  try {
    const connection: PoolClient = (await connect(req, res))!;
    const price = (await connection.queryObject<Station>(StationsRepo.getFuelPriceofStation(station, fuel))).rows;
    res.json(price[0]);
    return;
  } catch (e) {
    console.error(e.message);
    res.send("Error while retrieve data: " + e.message, 500);
    return;
  }
}
