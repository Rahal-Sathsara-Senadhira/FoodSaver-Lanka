const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3000;

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(bodyParser.json());

// MySQL Database Connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '2002',
    database: 'foodsaver_db'
});

db.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err);
        process.exit(1);
    }
    console.log('Connected to the database.');
});

// Signup Endpoints
app.post('/signup', async (req, res) => {
    const { username, password, role, additionalInfo } = req.body;

    // Validate input
    if (!username || !password || !role) {
        return res.status(400).json({ error: 'Username, password, and role are required.' });
    }

    handleRegistration(req, res);
});

// Add registration endpoints for specific roles
app.post('/register/:role', async (req, res) => {
    const role = req.params.role;
    req.body.role = role;
    
    // Validate input
    if (!req.body.username || !req.body.password) {
        return res.status(400).json({ error: 'Username and password are required.' });
    }
    
    handleRegistration(req, res);
});

// Helper function to handle registration logic
async function handleRegistration(req, res) {
    const { username, password, role, additionalInfo } = req.body;

    if (password.length < 6) {
        return res.status(400).json({ error: 'Password must be at least 6 characters long.' });
    }

    try {
        // Check if username already exists
        const [existingUser] = await db.promise().query(
            'SELECT id FROM users WHERE username = ?',
            [username]
        );

        if (existingUser.length > 0) {
            return res.status(409).json({ error: 'Username already exists.' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert into users table
        const [userResult] = await db.promise().query(
            'INSERT INTO users (username, password) VALUES (?, ?)',
            [username, hashedPassword]
        );

        const userId = userResult.insertId;

        // Insert into role-specific table
        if (role === 'donor') {
            const { restaurant_id, google_location, address } = additionalInfo;
            await db.promise().query(
                'INSERT INTO donor (restaurant_id, google_location, address, user_id) VALUES (?, ?, ?, ?)',
                [restaurant_id, google_location, address, userId]
            );
        } else if (role === 'ngo') {
            const { name, email, contact_no, contact_name, address_street } = additionalInfo;
            await db.promise().query(
                'INSERT INTO ngo (name, email, contact_no, contact_name, address_street, user_id) VALUES (?, ?, ?, ?, ?, ?)',
                [name, email, contact_no, contact_name, address_street, userId]
            );
        } else if (role === 'driver') {
            const { license_no, vehicle_type } = additionalInfo;
            await db.promise().query(
                'INSERT INTO driver (license_no, vehicle_type, user_id) VALUES (?, ?, ?)',
                [license_no, vehicle_type, userId]
            );
        } else {
            return res.status(400).json({ error: 'Invalid role specified.' });
        }

        res.status(201).json({ message: 'User registered successfully.' });
    } catch (error) {
        console.error('Error during signup:', error);
        res.status(500).json({ error: 'An error occurred during registration.' });
    }
}

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
