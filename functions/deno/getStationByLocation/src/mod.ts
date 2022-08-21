import { FindByLocationProcess } from "./find-by-location.ts";

// deno-lint-ignore no-explicit-any
export default function (req: any, res: any) {
  try {
    res.json(
      new FindByLocationProcess().aroundPosition(
        [],
        req.query.lat,
        req.query.lng,
        req.query.rayon,
        req.query.limit,
      ),
    );
  } catch (e) {
    console.error(e.message);
    res.send("Error while retrieve data: " + e.message, 500);
    return;
  }

  res.send("ok", 200);
}
