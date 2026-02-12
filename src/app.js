const express = require('express');
const dotenv = require('dotenv');

dotenv.config(); // must be called first

const usersRouter = require('./routes/users');
const notesRouter = require('./routes/notes');

const app = express();
app.use(express.json());

app.use('/api/users', usersRouter);
app.use('/api/notes', notesRouter);

module.exports = app;
