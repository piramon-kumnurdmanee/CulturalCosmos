# Tools
- Language: Bun
- Database: SQLite

# Steps
1. Install Bun
`curl https://bun.sh/install | bash`
2. Initialize Your Project with Bun
`mkdir CulturalCosmos
 cd CulturalCosmos`
`bun init`
3. Create database
- `sqlite3 LakotaAstronomy.db`
- Create table and insert data 

`CREATE TABLE Sites ( 
	id INTEGER PRIMARY KEY AUTOINCREMENT, 
	site_name TEXT NOT NULL, 
	latitude REAL NOT NULL, 
	longitude REAL NOT NULL, 
	constellation TEXT, 
	description TEXT, 
	tags TEXT, 
	image_url TEXT 
);`

`INSERT INTO Sites (site_name, latitude, longitude, constellation, description, tags, image_url)
VALUES 
('Site1', 43.933, -103.557, 'Orion', 'Description of Site1', 'tag1,tag2', 'http://example.com/image1.jpg'), ('Site2', 44.123, -103.678, 'Scorpius', 'Description of Site2', 'tag3,tag4', 'http://example.com/image2.jpg'); `

4. In the database, edit index.ts
index.ts
: main entry that contains the code to start a server and handles the routes
[Guide](https://bun.sh/docs/api/sqlite?fbclid=IwAR0aRfDqAXrreLnWhnR5txpFlU74HOAmWQNyVOvr7_8lc_mRSUFATz1yono)

