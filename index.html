
const express = require('express');
const mysql = require('mysql2/promise');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use('/assets', express.static('assets'));
app.use(express.static('.'));

// Create uploads directory if it doesn't exist
const uploadsDir = './uploads';
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
}

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadsDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'receipt-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ 
    storage: storage,
    fileFilter: function (req, file, cb) {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed!'), false);
        }
    },
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
});

// MySQL connection configuration
const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'promo_giveaway',
    port: process.env.DB_PORT || 3306
};

// Create database connection
async function createConnection() {
    try {
        const connection = await mysql.createConnection(dbConfig);
        return connection;
    } catch (error) {
        console.error('Database connection failed:', error);
        throw error;
    }
}

// Initialize database and create table
async function initializeDatabase() {
    try {
        const connection = await createConnection();
        
        // Create database if it doesn't exist
        await connection.execute(`CREATE DATABASE IF NOT EXISTS ${dbConfig.database}`);
        
        // Create participants table
        const createTableQuery = `
            CREATE TABLE IF NOT EXISTS participants (
                id INT AUTO_INCREMENT PRIMARY KEY,
                nome VARCHAR(100) NOT NULL,
                cognome VARCHAR(100) NOT NULL,
                indirizzo VARCHAR(255) NOT NULL,
                cap VARCHAR(10) NOT NULL,
                citta VARCHAR(100) NOT NULL,
                email VARCHAR(255) NOT NULL,
                receipt_filename VARCHAR(255),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `;
        
        await connection.execute(createTableQuery);
        console.log('Database and table initialized successfully');
        
        await connection.end();
    } catch (error) {
        console.error('Database initialization failed:', error);
    }
}

// API endpoint to handle form submission
app.post('/api/promo-apply', upload.single('screenshot'), async (req, res) => {
    try {
        const { nome, cognome, indirizzo, cap, citta, email } = req.body;
        
        // Validate required fields
        if (!nome || !cognome || !indirizzo || !cap || !citta || !email) {
            return res.status(400).json({ 
                success: false, 
                message: 'Tutti i campi sono obbligatori' 
            });
        }
        
        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ 
                success: false, 
                message: 'Formato email non valido' 
            });
        }
        
        // Check if file was uploaded
        if (!req.file) {
            return res.status(400).json({ 
                success: false, 
                message: 'La ricevuta di acquisto è obbligatoria' 
            });
        }
        
        const connection = await createConnection();
        // await connection.execute(`USE ${dbConfig.database}`);
        
        // Insert participant data
        const insertQuery = `
            INSERT INTO participants (nome, cognome, indirizzo, cap, citta, email, receipt_filename)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
        
        const [result] = await connection.execute(insertQuery, [
            nome, cognome, indirizzo, cap, citta, email, req.file.filename
        ]);
        
        await connection.end();
        
        res.json({ 
            success: true, 
            message: 'Registrazione completata con successo!',
            participantId: result.insertId
        });
        
    } catch (error) {
        console.error('Error processing form submission:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Errore interno del server' 
        });
    }
});

// API endpoint to get all participants (for admin purposes)
app.get('/api/participants', async (req, res) => {
    try {
        const connection = await createConnection();
        // await connection.execute(`USE ${dbConfig.database}`);
        
        const [rows] = await connection.execute('SELECT * FROM participants ORDER BY created_at DESC');
        
        await connection.end();
        
        res.json({ success: true, participants: rows });
    } catch (error) {
        console.error('Error fetching participants:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Errore nel recupero dei partecipanti' 
        });
    }
});

// Serve uploaded files
app.use('/uploads', express.static('uploads'));

// Serve the main HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Start server
app.listen(PORT, '0.0.0.0', async () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
    // await initializeDatabase();
});
