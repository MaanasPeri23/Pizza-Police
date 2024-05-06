import * as db from "../../services/database.mjs";

export default async function handler(req, res) {
  if (req.method === "POST") {
    await db.clear();
    return res.send();
  }
}
