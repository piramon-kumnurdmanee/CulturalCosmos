import { Database } from "bun:sqlite";
const byId = (a, b) => a.id - b.id

const db = new Database('LakotaAstronomy.db');
const descs = db.query("SELECT * FROM Description").all();
const sites = db.query("SELECT * FROM Sites").all()
  .sort(byId)
  .map(site => ({
    ...site,
    descriptions: descs
      .sort(byId)
      .filter(desc => desc.parent === site.id)
      .map(desc => desc.data)
  }))
await Bun.write('sites.json', JSON.stringify(sites, null, 2));
