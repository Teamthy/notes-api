const express = require('express');
const router = express.Router();
const pool = require('../db');

// GET all notes
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM notes ORDER BY id DESC');
    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// CREATE note
router.post('/', async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || typeof text !== 'string') {
      return res.status(400).json({ error: 'Invalid text input' });
    }

    const result = await pool.query(
      'INSERT INTO notes (text) VALUES ($1) RETURNING *',
      [text]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// UPDATE note
router.put('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { text } = req.body;

    const result = await pool.query(
      'UPDATE notes SET text = $1 WHERE id = $2 RETURNING *',
      [text, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE note
router.delete('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    const result = await pool.query(
      'DELETE FROM notes WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Not found' });
    }

    res.status(204).end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
