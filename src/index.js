const express = require('express');
const dotenv = require('dotenv');

dotenv.config();
const app = express();
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Notes API is running');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

const notesRouter = require('./routes/notes');
app.use('/api/notes', notesRouter);
