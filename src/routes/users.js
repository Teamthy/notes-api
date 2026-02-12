const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../db');

const router = express.Router();

if (!process.env.JWT_SECRET) {
  console.warn('Warning: JWT_SECRET not defined. JWT features may not work.');
}

// Register
router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password || password.length < 6) {
      return res.status(400).json({ error: 'Invalid input' });
    }

    const hashed = await bcrypt.hash(password, 12);

    const result = await pool.query(
      'INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id, username',
      [username, hashed]
    );

    res.status(201).json(result.rows[0]);

  } catch (err) {
    if (err.code === '23505') { // unique violation
      return res.status(409).json({ error: 'Username already exists' });
    }

    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Invalid input' });
    }

    const result = await pool.query(
      'SELECT id, username, password FROM users WHERE username=$1',
      [username]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = result.rows[0];

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ token });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
