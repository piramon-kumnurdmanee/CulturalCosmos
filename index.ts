import { serve } from "bun";
import { Database } from "bun:sqlite";

// Connect to SQLite database
const db = new Database('LakotaAstronomy.db');

// Function to get the request path
function getRequestPath(req: Request): string {
  return new URL(req.url).pathname;
}

// HTTP server to handle requests
serve({
  port: 3000,
  fetch: async (req) => {
    const path = getRequestPath(req);
    console.log(`Received request for URL path: ${path}`);

    if (path === "/") {
      return new Response("Welcome to the Cultural Cosmos API. Use /sites to get all sites, /site/{name} to get details of a specific site, and /add-site to add a new site.", {
        headers: { "Content-Type": "text/plain" },
      });
    }

    if (path === "/sites") {
      try {
        const sites = db.query("SELECT * FROM Sites").all();
        console.log("Query successful, returning data:", sites);
        return new Response(JSON.stringify(sites), {
          headers: { "Content-Type": "application/json" },
        });
      } catch (error) {
        console.error("Query error:", error);
        return new Response("Internal Server Error", { status: 500 });
      }
    }

    if (path.startsWith("/site/")) {
      const siteName = path.split("/").pop();
      if (siteName) {
        try {
          const site = db.query("SELECT * FROM Sites WHERE site_name = ?").get(siteName);
          if (site) {
            console.log(`Query successful, returning data for ${siteName}:`, site);
            return new Response(JSON.stringify(site), {
              headers: { "Content-Type": "application/json" },
            });
          } else {
            return new Response("Site not found", { status: 404 });
          }
        } catch (error) {
          console.error("Query error:", error);
          return new Response("Internal Server Error", { status: 500 });
        }
      }
    }

    if (path === "/add-site" && req.method === "POST") {
      try {
        const body = await req.json();
        const { site_name, latitude, longitude, constellation, description, tags, image_url } = body;

        db.run(
          `INSERT INTO Sites (site_name, latitude, longitude, constellation, description, tags, image_url)
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [site_name, latitude, longitude, constellation, description, tags, image_url]
        );

        console.log(`Inserted data for ${site_name}`);
        return new Response("Site added successfully", { status: 201 });
      } catch (error) {
        console.error("Insert error:", error);
        return new Response("Internal Server Error", { status: 500 });
      }
    }

    return new Response("Not Found", { status: 404 });
  },
});

console.log(`Server running on port 3000`);
