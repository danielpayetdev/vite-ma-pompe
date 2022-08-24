import { connect } from "../../common/database/database.ts";
import { StationsRepo } from "../../common/repository/stations.repo.ts";
import { PoolClient } from "./deps.ts";
import { DownloadData } from "./download-data.ts";

// deno-lint-ignore no-explicit-any
export default async function (req: any, res: any) {
  if (
    !req.env["FORCE_HTTP"] &&
    req.env["APPWRITE_FUNCTION_TRIGGER"] !== "schedule"
  ) {
    res.send("Not a schedule trigger", 403);
    return;
  }

  const data = await new DownloadData().download();

  if (data) {
    const connection: PoolClient = (await connect(req, res))!;
    try {
      const stationId: number[] = [];
      let itemSaved = 0;
      while (itemSaved <= data.length) {
        const query = await connection.queryObject<{ _id: number }>(
          StationsRepo.insertAll(data.slice(itemSaved, itemSaved + 100)),
        );
        stationId.push(...query.rows.map((o) => o._id));
        itemSaved = itemSaved + 100;
      }
      await connection.queryObject(
        StationsRepo.deleteAll(stationId),
      );
    } catch (e) {
      console.error(e.message);
      res.send("Error while saving data: " + e.message, 500);
      return;
    } finally {
      connection.release();
    }
  } else {
    res.send("Error while downloading data", 500);
    return;
  }
  res.send("ok", 200);
}