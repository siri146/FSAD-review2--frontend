import express from 'express';
import cors from 'cors';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const allowedOrigins = ['http://localhost:5173', 'http://127.0.0.1:5173'];
app.use(cors({ origin: allowedOrigins }));
app.use(express.json());

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'extracurricularactivities',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

app.post('/api/auth/signup', async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Name, email, and password are required.' });
  }

  try {
    const [existing] = await pool.execute('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(409).json({ message: 'Account with this email already exists.' });
    }

    await pool.execute(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      [name, email, password, 'student']
    );

    return res.status(201).json({
      email,
      name,
      role: 'student',
      token: 'dummy-token'
    });
  } catch (error) {
    console.error('Signup error:', error);
    return res.status(500).json({ message: 'Unable to register at this time.' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  try {
    const [rows] = await pool.execute('SELECT * FROM users WHERE email = ?', [email]);
    if (rows.length === 0) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const user = rows[0];
    if (user.password !== password) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    return res.json({
      email: user.email,
      name: user.name,
      role: user.role || 'student',
      token: 'dummy-token'
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Unable to authenticate at this time.' });
  }
});

app.get('/api/registrations', async (req, res) => {
  const { email } = req.query;

  if (!email) {
    return res.status(400).json({ message: 'Email is required.' });
  }

  try {
    const [users] = await pool.execute('SELECT id FROM users WHERE email = ?', [email]);
    if (users.length === 0) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const user = users[0];
    const [rows] = await pool.execute(
      `SELECT r.event_id, e.title AS eventTitle
       FROM registrations r
       LEFT JOIN events e ON r.event_id = e.id
       WHERE r.user_id = ?`,
      [user.id]
    );

    return res.json({ registrations: rows });
  } catch (error) {
    console.error('Get registrations error:', error);
    return res.status(500).json({ message: 'Unable to load registrations.' });
  }
});

app.post('/api/registrations', async (req, res) => {
  const { email, fullName, phone, specialRequirements, eventId, eventTitle } = req.body;

  if (!email || !fullName || !phone || !eventTitle) {
    return res.status(400).json({ message: 'Email, full name, phone, and event title are required.' });
  }

  try {
    const [users] = await pool.execute('SELECT id FROM users WHERE email = ?', [email]);
    if (users.length === 0) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const user = users[0];
    const [events] = await pool.execute('SELECT id FROM events WHERE id = ? OR title = ?', [eventId, eventTitle]);
    let event;

    if (events.length === 0) {
      const [insertResult] = await pool.execute(
        'INSERT INTO events (title, category, description, total_seats) VALUES (?, ?, ?, ?)',
        [eventTitle, 'General', 'Automatically created event', 100]
      );
      event = { id: insertResult.insertId };
    } else {
      event = events[0];
    }

    await pool.execute(
      `INSERT INTO registrations (user_id, event_id, full_name, email, phone, special_requirements)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [user.id, event.id, fullName, email, phone, specialRequirements || null]
    );

    return res.status(201).json({ message: 'Registration saved.' });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ message: 'Unable to save registration.' });
  }
});

app.delete('/api/registrations', async (req, res) => {
  const { email, eventId } = req.query;

  if (!email || !eventId) {
    return res.status(400).json({ message: 'Email and eventId are required.' });
  }

  try {
    const [users] = await pool.execute('SELECT id FROM users WHERE email = ?', [email]);
    if (users.length === 0) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const user = users[0];
    const [events] = await pool.execute('SELECT id FROM events WHERE id = ? OR title = ?', [eventId, eventId]);
    if (events.length === 0) {
      return res.status(404).json({ message: 'Event not found.' });
    }

    const event = events[0];
    await pool.execute('DELETE FROM registrations WHERE user_id = ? AND event_id = ?', [user.id, event.id]);

    return res.json({ message: 'Registration removed.' });
  } catch (error) {
    console.error('Delete registration error:', error);
    return res.status(500).json({ message: 'Unable to remove registration.' });
  }
});

const port = process.env.SERVER_PORT || 2006;
app.listen(port, () => {
  console.log(`Auth server listening on http://localhost:${port}`);
});
