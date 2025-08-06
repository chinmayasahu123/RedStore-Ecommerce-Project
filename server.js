const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const cors = require('cors');
const nodemailer = require('nodemailer');
require('dotenv').config();
const path = require('path');

const app = express();
const port = 3000;
app.use(express.static(path.join(__dirname, '../public')));

// Sample route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',         
  password: '@chinmaya123',     
  database: 'userdb'    
});

db.connect(err => {
  if (err) {
    console.error('DB connection failed:', err);
    return;
  }
  console.log('✅ Connected to MySQL database');
});
// Test route
app.get('/', (req, res) => {
  res.send('Hello from backend');
});
app.post('/send-email', (req, res) => {
  const { from_name, from_email, message } = req.body;

  if (!from_name || !from_email || !message) {
    return res.status(400).json({ success: false, message: 'All fields are required.' });
  }

  console.log("📩 Received contact form submission:", req.body);

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'chinmaya123@gmail.com',        // 🔁 Replace with your Gmail
      pass: 'omfq gipj vjvn'      // 🔁 Replace with Gmail App Password
    }
  });

  const mailOptions = {
    from: 'bheem67@gmail.com',          // ✅ Match sender email here
    to: 'chinmaya123@gmail.com',
    subject: `New Contact Form Message from ${from_name}`,
    text: `From: ${from_name}\nEmail: ${from_email}\n\nMessage:\n${message}`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("❌ Email send failed:", error);
      return res.status(500).json({ success: false, message: 'Failed to send email.' });
    }

    // ✅ Save to DB
    db.query(
      'INSERT INTO messages (from_name, from_email, message) VALUES (?, ?, ?)',
      [from_name, from_email, message],
      (err, result) => {
        if (err) {
          console.error("❌ Failed to insert into DB:", err);
          return res.status(500).json({ success: false, message: 'Email sent but DB save failed.' });
        }

        console.log("✅ Message stored in database.");
        res.json({ success: true, message: 'Message sent and saved successfully!' });
      }
    );
  });
});




// REGISTER API (plain password)
app.post('/register', (req, res) => {
  const { name, email, password,phoneNumber } = req.body;

  // Check for missing fields
  if (!name || !email || !password || !phoneNumber) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  // Check if user already exists
  db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
    if (err) return res.status(500).json({ message: 'DB error' });

    if (results.length > 0) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Insert user into DB (plain password)
    db.query(
      'INSERT INTO users (name, email, password, phoneNumber) VALUES (?, ?, ?, ?)',
      [name, email, password , phoneNumber],
      (err, result) => {
        if (err) return res.status(500).json({ message: 'Insert failed'});

        res.status(201).json({ message: 'User registered successfully' });
      }
    );
  });
});

// LOGIN API (plain password)
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
    if (err) return res.status(500).json({ message: 'Database error' });

    if (results.length === 0) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const user = results[0];

    if (password !== user.password) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    res.status(200).json({ message: 'Login successful', user: { id: user.id, name: user.name, email: user.email } });
  });
});

// Start server
app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});
