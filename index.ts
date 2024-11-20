import { serve } from "bun";
import { Database } from "bun:sqlite";

// Connect to SQLite database
const db = new Database('LakotaAstronomy.db');

// Function to get the request path
function getRequestPath(req: Request): string {
  return new URL(req.url).pathname;
}

<<<<<<< HEAD
const port = process.env.PORT || 3000;

// HTTP server to handle requests
serve({
  port,
=======
// HTTP server to handle requests
serve({
  port: 3000,
>>>>>>> f1a87ab65f37cd9cb2be7732a06363be23d169ec
  fetch: async (req) => {
    const path = getRequestPath(req);
    console.log(`Received request for URL path: ${path}`);

<<<<<<< HEAD
    const headers = {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*", // Enable CORS for all origins
    };

    if (path === "/") {
      return new Response(
        "Welcome to the Cultural Cosmos API. Use /sites to get all sites, /site/{name} to get details of a specific site, and /add-site to add a new site.",
        { headers }
      );
=======
    if (path === "/") {
      return new Response("Welcome to the Cultural Cosmos API. Use /sites to get all sites, /site/{name} to get details of a specific site, and /add-site to add a new site.", {
        headers: { "Content-Type": "text/plain" },
      });
>>>>>>> f1a87ab65f37cd9cb2be7732a06363be23d169ec
    }

    if (path === "/sites") {
      try {
<<<<<<< HEAD
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
        console.log("Query successful, returning data:", sites);
        return new Response(JSON.stringify(sites), { headers });
      } catch (error) {
        console.error("Query error:", error);
        return new Response("Internal Server Error", { status: 500, headers });
      }
    }

    const siteMatch = path.match(/^\/site\/(.+)/);
    if (siteMatch) {
      const siteName = decodeURIComponent(siteMatch[1]); // Decode in case of URL encoding
      try {
        const site = db.query("SELECT * FROM Sites WHERE site_name = ?").get(siteName);
        if (site) {
          console.log(`Query successful, returning data for ${siteName}:`, site);
          return new Response(JSON.stringify(site), { headers });
        } else {
          return new Response("Site not found", { status: 404, headers });
        }
      } catch (error) {
        console.error("Query error:", error);
        return new Response("Internal Server Error", { status: 500, headers });
=======
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
>>>>>>> f1a87ab65f37cd9cb2be7732a06363be23d169ec
      }
    }

    if (path === "/add-site" && req.method === "POST") {
<<<<<<< HEAD
      let body;
      try {
        body = await req.json();
      } catch (error) {
        console.error("Invalid JSON:", error);
        return new Response("Invalid JSON format", { status: 400, headers });
      }

      const { site_name, latitude, longitude, constellation, description, tags, image_url } = body;

      if (!site_name || typeof latitude !== "number" || typeof longitude !== "number") {
        return new Response("Missing or invalid fields", { status: 400, headers });
      }

      try {
=======
      try {
        const body = await req.json();
        const { site_name, latitude, longitude, constellation, description, tags, image_url } = body;

>>>>>>> f1a87ab65f37cd9cb2be7732a06363be23d169ec
        db.run(
          `INSERT INTO Sites (site_name, latitude, longitude, constellation, description, tags, image_url)
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [site_name, latitude, longitude, constellation, description, tags, image_url]
        );
<<<<<<< HEAD
        console.log(`Inserted data for ${site_name}`);
        return new Response("Site added successfully", { status: 201, headers });
      } catch (error) {
        console.error("Insert error:", error);
        return new Response("Internal Server Error", { status: 500, headers });
      }
    }

    return new Response("Not Found", { status: 404, headers });
  },
});

console.log(`Server running on port ${port}`);

const byId = (a, b) => a.id - b.id
=======

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
>>>>>>> f1a87ab65f37cd9cb2be7732a06363be23d169ec
