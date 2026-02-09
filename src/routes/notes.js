const express = require('express');
const router = express.Router();

let notes = []; // temporary in-memory store

router.get('/', (req, res) => res.json(notes));

router.post('/', (req, res) => {
  const note = { id: Date.now(), text: req.body.text };
  notes.push(note);
  res.status(201).json(note);
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
