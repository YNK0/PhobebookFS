const express = require('express');
const cors = require('cors');
const app = express();
const mongoose = require('mongoose');
require('dotenv').config();

const port = process.env.PORT || 3001;
const url = process.env.URL;


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

mongoose.set('strictQuery', false);

mongoose.connect(url)
    .then(() => {
        console.log('Conectado a MongoDB');
    })
    .catch((err) => {
        console.error('Error conectándose a MongoDB:', err.message);
        process.exit(1);
    });

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
});

personSchema.set('toJSON', {
    transform: (_document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    },
});

const Person = mongoose.model('Person', personSchema);


app.get('/', (_req, res) => {
    res.send('<h1>API REST FROM NOTES</h1>');
});

app.get('/persons', (_req, res) => {
    Person.find({}).then(persons => {
        res.json(persons);
    });
});

app.delete('/persons/:id', (req, res) => {
    const id = req.params.id;
    Person.findByIdAndDelete(id)
        .then(() => {
            res.status(204).end();
        })
        .catch(err => {
            console.error('Error al eliminar la persona:', err.message);
            res.status(400).end();
        });
});

app.post('/persons', (req, res) => {
    const body = req.body;
    if (!body.name || !body.number) {
        return res.status(400).json({
            error: 'content missing'
        });
    }

    const note = {
        name: body.name,
        number: body.number
    };

    const person = new Person(note);
    person.save().then(savedPerson => {
        res.json(savedPerson);
    });
});

app.put('/persons/:id', (req, res) => {
  const id = req.params.id;
  const body = req.body;
  
  const note = {
    name: body.name,
    number: body.number
  };
  
  Person.findByIdAndUpdate(id, note, { new: true })
    .then(updatedPerson => {
      res.json(updatedPerson);
    })
    .catch(err => {
      console.error('Error al actualizar la persona:', err.message);
      res.status(400).end();
    });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});