
const express = require('express');
const cors = require('cors');

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
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
            <h1>🎉 Gioca e vinci!</h1>
            <p>In palio una Videocamera Full HD</p>
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
                <p style="margin: 0; color: #666;">Perfetta per catturare i tuoi DJ Set, Eventi, e molto altro!</p>
            </div>
            
            <div class="message">
                Grazie per aver acquistato l'album e per partecipare al nostro sorteggio. 
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

app.post('/send-mail', async (req, res) => {
    try {
        const { email, nome, cognome } = req.body;

        if (!email || !nome || !cognome) {
            return res.status(400).json({ success: false, message: 'Missing fields' });
        }

        const emailSent = await sendConfirmationEmail(email, nome, cognome);

        if (emailSent) {
            return res.json({ success: true, message: 'Email sent successfully' });
        } else {
            return res.status(500).json({ success: false, message: 'Failed to send email' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Start server
app.listen(PORT, '0.0.0.0', async () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
    // await initializeDatabase();
});
