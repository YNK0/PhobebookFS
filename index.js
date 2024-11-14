const express = require('express');
const cors = require('cors');
const app = express();


app.use(cors());
app.use(express.json());
app.use(express.static('dist'));

const requestLogger = (req, _res, next) => {
    console.log('Method:', req.method);
    console.log('Path:', req.path);
    console.log('Body:', req.body);
    console.log('---');
    next();
};

app.use(requestLogger);

let notes = [
    {
      "name": "Arto Hellas",
      "number": "040-1234567",
      "id": "1"
    },
    {
      "name": "Ada Lovelace",
      "number": "39-44-5323523",
      "id": "2"
    },
    {
      "name": "Dan Abramov",
      "number": "12-43-234345",
      "id": "3"
    },
    {
      "name": "Mary Poppendieck",
      "number": "39-23-6423122",
      "id": "4"
    },
    {
      "id": "d06e",
      "name": "Francisco",
      "number": "9931475979"
    },
    {
      "id": "9207",
      "name": "Hola",
      "number": "2376273"
    },
    {
      "id": "5ea3",
      "name": "Francisco Vargas",
      "number": "9931475979"
    },
    {
      "id": "517f",
      "name": "Francisco ihfiueh",
      "number": "937297392739"
    }
  ];

app.get('/', (_req, res) => {
    res.send('<h1>API REST FROM NOTES</h1>');
});

app.get('/persons', (_req, res) => {
    res.json(notes);
});

app.delete('/persons/:id', (req, res) => {
    const id = Number(req.params.id);
    notes = notes.filter(note => note.id !== id);
    res.status(204).end();
});

const generateId = () => {
    const maxId = notes.length > 0
        ? Math.max(...notes.map(n => n.id))
        : 0;
    return maxId + 1;
};

app.post('/persons', (req, res) => {
    const body = req.body;
    if (!body.name || !body.number) {
        return res.status(400).json({
            error: 'content missing'
        });
    }

    const note = {
        id: String(Math.floor(Math.random() * 1000)),
        name: body.name,
        number: body.number
    };

    notes = [...notes, note];
    res.json(note);
});

app.put('/persons/:id', (req, res) => {
  const id = String(req.params.id);
  const body = req.body;
  const note = notes.find(note => note.id === id);
  if (!note) {
      return res.status(404).end();
  }

  const updatedNote = {
      ...note,
      number: body.number
  };

  notes = notes.map(note => note.id !== id ? note : updatedNote);
  res.json(updatedNote);
});

const port = process.env.PORT || 3001;

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});