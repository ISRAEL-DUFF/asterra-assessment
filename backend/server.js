const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');
const { Client } = require('pg');
const dotenv = require('dotenv');

dotenv.config({})

// Database configuration
const dbConfig = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  ssl: {
    rejectUnauthorized: false
  }
};

const DB_SCHEMA = 'israel_duff'

// MIME types for static files
const mimeTypes = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

// Helper function to parse JSON body
const parseBody = (req) => {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => body += chunk.toString());
    req.on('end', () => {
      try {
        resolve(JSON.parse(body));
      } catch (e) {
        resolve({});
      }
    });
    req.on('error', reject);
  });
};

// Helper function to serve static files
const serveStaticFile = (res, filePath) => {
  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end('<h1>404 - File Not Found</h1>');
      } else {
        res.writeHead(500);
        res.end('Server Error: ' + err.code);
      }
    } else {
      const ext = path.extname(filePath);
      const contentType = mimeTypes[ext] || 'application/octet-stream';
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content);
    }
  });
};

const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  const method = req.method;

  console.log({
    pathname,
    method,
    parsedUrl
  })

  // API Routes
  if (pathname.startsWith('/api')) {
    // CORS headers for API routes
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    };

    // Handle CORS preflight
    if (method === 'OPTIONS') {
      res.writeHead(200, corsHeaders);
      res.end();
      return;
    }

    const client = new Client(dbConfig);

    try {
        await client.connect();

        // GET all users
        if (pathname === '/api/users' && method === 'GET') {
        const result = await client.query(`SELECT * FROM ${DB_SCHEMA}.users ORDER BY id`);
        res.writeHead(200, { ...corsHeaders, 'Content-Type': 'application/json' });
        res.end(JSON.stringify(result.rows));
        }
        
        // POST new user
        else if (pathname === '/api/users' && method === 'POST') {
        const body = await parseBody(req);
        const { first_name, last_name, address, phone_number } = body;
        
        const result = await client.query(
            `INSERT INTO ${DB_SCHEMA}.users (first_name, last_name, address, phone_number) VALUES ($1, $2, $3, $4) RETURNING *`,
            [first_name, last_name, address, phone_number]
        );
        
        res.writeHead(201, { ...corsHeaders, 'Content-Type': 'application/json' });
        res.end(JSON.stringify(result.rows[0]));
        }
        
        // POST new hobby
        else if (pathname === '/api/hobbies' && method === 'POST') {
        const body = await parseBody(req);
        const { user_id, hobbies } = body;
        
        const result = await client.query(
            `INSERT INTO ${DB_SCHEMA}.hobbies (user_id, hobbies) VALUES ($1, $2) RETURNING *`,
            [user_id, hobbies]
        );
        
        res.writeHead(201, { ...corsHeaders, 'Content-Type': 'application/json' });
        res.end(JSON.stringify(result.rows[0]));
        }
        
        // GET all users with hobbies
        else if (pathname === '/api/users-hobbies' && method === 'GET') {
        const result = await client.query(`
            SELECT 
            u.id,
            u.first_name,
            u.last_name,
            u.address,
            u.phone_number,
            h.hobbies
            FROM ${DB_SCHEMA}.users u
            LEFT JOIN ${DB_SCHEMA}.hobbies h ON u.id = h.user_id
            ORDER BY u.id, h.hobbies
        `);
        
        res.writeHead(200, { ...corsHeaders, 'Content-Type': 'application/json' });
        res.end(JSON.stringify(result.rows));
        }
        
        // DELETE hobby
        else if (pathname.startsWith('/api/hobbies/') && method === 'DELETE') {
        const parts = pathname.split('/');
        const userId = parts[3];
        const hobby = decodeURIComponent(parts[4]);
        
        await client.query(
            `DELETE FROM ${DB_SCHEMA}.hobbies WHERE user_id = $1 AND hobbies = $2`,
            [userId, hobby]
        );
        
        res.writeHead(200, { ...corsHeaders, 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true }));
        }
        
        // DELETE user
        else if (pathname.startsWith('/api/users/') && method === 'DELETE') {
        const userId = pathname.split('/')[3];
        
        await client.query(`DELETE FROM ${DB_SCHEMA}.users WHERE id = $1`, [userId]);
        
        res.writeHead(200, { ...corsHeaders, 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true }));
        }
        
        else {
        res.writeHead(404, { ...corsHeaders, 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Not found' }));
        }

    } catch (error) {
        console.error('Database error:', error);
        res.writeHead(500, { ...corsHeaders, 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: error.message }));
    } finally {
        await client.end();
    }
  } 
  // Serve static files
  else {
    let filePath = path.join(__dirname, 'public', pathname === '/' ? 'index.html' : pathname);
    
    // Check if file exists
    fs.access(filePath, fs.constants.F_OK, (err) => {
      if (err) {
        // If file doesn't exist and it's not a file with extension, serve index.html (for SPA routing)
        if (!path.extname(pathname)) {
          filePath = path.join(__dirname, 'public', 'index.html');
        }
      }
      serveStaticFile(res, filePath);
    });
  }
});

const PORT = process.env.SERVER_PORT ?? 3001;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`API available at http://localhost:${PORT}/api`);
  console.log(`Frontend available at http://localhost:${PORT}`);
});