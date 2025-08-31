const http = require('http');
const url = require('url');
const mysql = require('mysql2/promise');

// CORS headers
const setCORSHeaders = (res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
};

// Database configuration
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '2002',
  database: 'foodsaver_db'
};

// Create HTTP server
const server = http.createServer(async (req, res) => {
  setCORSHeaders(res);
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  const parsedUrl = url.parse(req.url, true);
  const path = parsedUrl.pathname;
  
  console.log(`${req.method} ${path}`);

  // Ensure response ends properly after registration
  if (req.method === 'POST' && path.startsWith('/register/')) {
    const userType = path.split('/')[2]; // ngo, driver, or donor
    
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    
    req.on('end', async () => {
      try {
        const userData = JSON.parse(body);
        console.log('Received data for', userType, ':', userData);
        
        // Validate required fields based on user type
        if (userType === 'ngo' && (!userData.name || !userData.contact_no || !userData.email)) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Missing required fields: name, contact_no, email' }));
          return;
        }
        if (userType === 'driver' && (!userData.first_name || !userData.last_name || !userData.NIC || !userData.age || !userData.phone_number || !userData.email || !userData.vehicle_type || !userData.vehicle_number || !userData.address_street)) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Missing required fields for driver' }));
          return;
        }
        if (userType === 'donor' && (!userData.restaurant_id || !userData.google_location || !userData.address)) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Missing required fields for donor' }));
          return;
        }
        
        // Add detailed validation error messages
        if (userType === 'ngo') {
          if (!userData.name) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Missing field: name' }));
            return;
          }
          if (!userData.contact_no) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Missing field: contact_no' }));
            return;
          }
          if (!userData.email) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Missing field: email' }));
            return;
          }
        } else if (userType === 'driver') {
          if (!userData.first_name) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Missing field: first_name' }));
            return;
          }
          if (!userData.last_name) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Missing field: last_name' }));
            return;
          }
          if (!userData.NIC) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Missing field: NIC' }));
            return;
          }
          if (!userData.age) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Missing field: age' }));
            return;
          }
          if (!userData.phone_number) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Missing field: phone_number' }));
            return;
          }
          if (!userData.email) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Missing field: email' }));
            return;
          }
          if (!userData.vehicle_type) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Missing field: vehicle_type' }));
            return;
          }
          if (!userData.vehicle_number) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Missing field: vehicle_number' }));
            return;
          }
          if (!userData.address_street) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Missing field: address_street' }));
            return;
          }
        } else if (userType === 'donor') {
          if (!userData.restaurant_id) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Missing field: restaurant_id' }));
            return;
          }
          if (!userData.google_location) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Missing field: google_location' }));
            return;
          }
          if (!userData.address) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Missing field: address' }));
            return;
          }
        }
        
        // Create database connection
        let connection;
        try {
          connection = await mysql.createConnection(dbConfig);
        } catch (dbError) {
          console.error('Database connection failed:', dbError);
          throw new Error('Database connection failed. Please ensure MySQL is running and the database exists.');
        }
        
        try {
          // Start transaction
          await connection.beginTransaction();
          
          // Insert into users table
          const [userResult] = await connection.execute(
            'INSERT INTO users (username, password, user_type) VALUES (?, ?, ?)',
            [userData.username || 'temp_user', userData.password || 'temp_pass', userType]
          );
          
          const userId = userResult.insertId;
          
          // Insert into specific table based on user type
          if (userType === 'ngo') {
            await connection.execute(
              'INSERT INTO ngo (name, email, contact_no, contact_name, address_street, user_id) VALUES (?, ?, ?, ?, ?, ?)',
              [
                userData.name || '',
                userData.email || '',
                userData.contact_no || '',
                userData.contact_name || '',
                userData.address_street || '',
                userId
              ]
            );
          } else if (userType === 'driver') {
            await connection.execute(
              'INSERT INTO driver (first_name, last_name, vehicle_type, vehicle_number, age, phone_number, email, NIC, address_street, user_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
              [
                userData.first_name || '',
                userData.last_name || '',
                userData.vehicle_type || '',
                userData.vehicle_number || '',
                userData.age || 0,
                userData.phone_number || '',
                userData.email || '',
                userData.NIC || '',
                userData.address_street || '',
                userId
              ]
            );
          } else if (userType === 'donor') {
            await connection.execute(
              'INSERT INTO donor (restaurant_id, google_location, address, user_id) VALUES (?, ?, ?, ?)',
              [
                userData.restaurant_id || '',
                userData.google_location || '',
                userData.address || '',
                userId
              ]
            );
          }
          
          // Commit transaction
          await connection.commit();
          
          res.writeHead(201, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ 
            message: `${userType} registered successfully`, 
            user_id: userId 
          }));
          
        } catch (error) {
          // Rollback transaction
          await connection.rollback();
          throw error;
        } finally {
          // Close connection
          await connection.end();
        }
        
      } catch (error) {
        console.error('Registration error:', error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ 
          error: 'Registration failed: ' + error.message 
        }));
      }
    });
    
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Not found' }));
  }
});

const PORT = 8081;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
