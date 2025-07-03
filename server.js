
const express = require('express');
const mysql = require('mysql2/promise');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Email configuration
const transporter = nodemailer.createTransport({
    host: 'live.smtp.mailtrap.io', // You can change this to your preferred email service
    port: 587,
    auth: {
        user: process.env.EMAIL_USER, // Your email
        pass: process.env.EMAIL_PASS  // Your email password or app password
    }
});

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

// Email template function
function createEmailTemplate(nome, cognome) {
    return `
<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Conferma Partecipazione - DJ Sanny J</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #1c1a1e, #2a252f);
            margin: 0;
            padding: 20px;
            color: #333;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background: #ffffff;
            border-radius: 20px;
            overflow: hidden;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
        }
        .header {
            background: linear-gradient(180deg, rgba(215, 107, 194, 1) 0%, rgba(44, 82, 202, 1) 100%);
            color: white;
            padding: 40px 30px;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 28px;
            font-weight: 600;
        }
        .header p {
            margin: 10px 0 0;
            font-size: 16px;
            opacity: 0.9;
        }
        .content {
            padding: 40px 30px;
            line-height: 1.6;
        }
        .greeting {
            font-size: 18px;
            color: #2c52ca;
            font-weight: 600;
            margin-bottom: 20px;
        }
        .message {
            font-size: 16px;
            color: #555;
            margin-bottom: 25px;
        }
        .highlight-box {
            background: linear-gradient(135deg, #f8f9ff, #e8f0ff);
            border-left: 4px solid #d76bc2;
            padding: 20px;
            margin: 25px 0;
            border-radius: 8px;
        }
        .prize-info {
            text-align: center;
            margin: 30px 0;
        }
        .prize-icon {
            font-size: 48px;
            margin-bottom: 15px;
        }
        .footer {
            background: #f8f9fa;
            padding: 30px;
            text-align: center;
            color: #666;
            font-size: 14px;
        }
        .social-links {
            margin: 20px 0;
        }
        .social-links a {
            color: #d76bc2;
            text-decoration: none;
            margin: 0 10px;
        }
        .button {
            display: inline-block;
            background: linear-gradient(180deg, rgba(215, 107, 194, 1) 0%, rgba(44, 82, 202, 1) 100%);
            color: white;
            padding: 12px 30px;
            text-decoration: none;
            border-radius: 25px;
            font-weight: 600;
            margin: 20px 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎉 Benvenuto nel Concorso!</h1>
            <p>DJ Sanny J - Concorso Telecamera Full HD</p>
        </div>
        
        <div class="content">
            <div class="greeting">
                Ciao ${nome} ${cognome}! 👋
            </div>
            
            <div class="message">
                <strong>Congratulazioni!</strong> La tua partecipazione al concorso è stata registrata con successo nel nostro database.
            </div>
            
            <div class="highlight-box">
                <h3 style="margin: 0 0 15px; color: #2c52ca;">✅ Cosa succede ora?</h3>
                <ul style="margin: 0; padding-left: 20px;">
                    <li>I tuoi dati sono stati salvati in sicurezza</li>
                    <li>La tua ricevuta è stata verificata</li>
                    <li>Sei ufficialmente in gara per vincere!</li>
                    <li>Ti contatteremo via email se sarai tra i vincitori</li>
                </ul>
            </div>
            
            <div class="prize-info">
                <div class="prize-icon">🎥</div>
                <h3 style="color: #d76bc2; margin: 0;">Premio in Palio</h3>
                <p style="margin: 10px 0; font-size: 18px; font-weight: 600;">Telecamera Full HD</p>
                <p style="margin: 0; color: #666;">Perfetta per catturare i tuoi momenti migliori!</p>
            </div>
            
            <div class="message">
                Grazie per aver acquistato l'album e per partecipare al nostro concorso. 
                Il sorteggio avverrà secondo i termini e condizioni pubblicati sul sito.
            </div>
            
            <div style="text-align: center;">
                <p><strong>In bocca al lupo! 🍀</strong></p>
                <p style="color: #d76bc2; font-weight: 600;">- Il Team di DJ Sanny J</p>
            </div>
        </div>
        
        <div class="footer">
            <div class="social-links">
                <p>Seguici sui social per rimanere aggiornato:</p>
                <a href="https://www.instagram.com/djsannyjofficial/">Instagram</a> | 
                <a href="https://www.facebook.com/santo.finocchiaro.djsannyj">Facebook</a> | 
                <a href="https://www.tiktok.com/@djsannyjofficial">TikTok</a>
            </div>
            <p>
                Questa email è stata inviata automaticamente. Non rispondere a questa email.<br>
                Per domande, contattaci tramite i nostri canali ufficiali.
            </p>
        </div>
    </div>
</body>
</html>
    `;
}

// Send confirmation email
async function sendConfirmationEmail(email, nome, cognome) {
    try {
        const mailOptions = {
            from: `"Modulo Inviato" <${process.env.EMAIL_SENDER}>`,
            to: email,
            
            subject: '🎉 Conferma Partecipazione - Concorso DJ Sanny J',
            html: createEmailTemplate(nome, cognome)
        };

        const info = await transporter.sendMail(mailOptions);

        console.log('Email sent successfully:', info.messageId);
        return true;
    } catch (error) {
        console.error('Error sending email:', error);
        return false;
    }
}

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
        
        // Send confirmation email
        const emailSent = await sendConfirmationEmail(email, nome, cognome);
        
        if (emailSent) {
            console.log(`Confirmation email sent to ${email}`);
        } else {
            console.log(`Failed to send confirmation email to ${email}`);
        }

        let message = 'Grazie per aver partecipato! Controlla la tua email per la conferma. 👀';
        if (!emailSent) {
            message = 'Grazie per aver partecipato! Ti invieremo una email se sarai il vincitore 👀.';
        }

        res.json({ 
            success: true,
            message: message,
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
