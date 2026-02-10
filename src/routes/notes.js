const express = require('express');
const router = express.Router();

let notes = []; // temporary in-memory store

const pool = require('../db');

router.get('/', async (req, res) => {
  const result = await pool.query('SELECT * FROM notes');
  res.json(result.rows);
});

router.post('/', async (req, res) => {
  const { text } = req.body;
  const result = await pool.query(
    'INSERT INTO notes (text) VALUES ($1) RETURNING *',
    [text]
  );
  res.status(201).json(result.rows[0]);
});

router.put('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const note = notes.find(n => n.id === id);
  if (!note) return res.status(404).json({ error: 'Not found' });
  note.text = req.body.text;
  res.json(note);
});

router.delete('/:id', (req, res) => {
  notes = notes.filter(n => n.id !== parseInt(req.params.id));
  res.status(204).end();
});

module.exports = router;
