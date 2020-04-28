require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");

/* mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

personSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

const People = mongoose.model("People", personSchema); */

app.use(cors());
app.use(express.json());
app.use(express.static("build"));

const requestLogger = (request, response, next) => {
  console.log("Method:", request.method);
  console.log("Path:  ", request.path);
  console.log("Body:  ", request.body);
  console.log("---");
  next();
};

app.use(requestLogger);

morgan.token("body", function (req, res) {
  return JSON.stringify(req.body);
});

app.use(
  morgan(
    ":method :url :status :res[content-length] - :response-time ms :body ",
    {
      stream: requestLogger.successLogStream,
      skip: function (req, res) {
        return req.method !== "POST";
      },
    }
  )
);

let people = [
  {
    name: "Arto Hellas",
    number: "040-123456",
    id: 1,
  },
  {
    name: "Ada Lovelace",
    number: "39-44-5323523",
    id: 2,
  },
  {
    name: "Dan Abramov",
    number: "12-43-234345",
    id: 3,
  },
  {
    name: "Mary Poppendieck",
    number: "39-23-6423122",
    id: 4,
  },
];

app.get("/", (req, res) => {
  res.send("<h1>Hello World!</h1>");
});

/* app.get("/api/info", (req, res) => {
  res.send(`
  <h3>There are ${people.length} people in the phonebook. </h3>
  <div>${new Date()} </div>
  `);
}); */

/* app.get("/api/people", (request, response) => {
  People.find({}).then((people) => {
    response.json(people.map((person) => person.toJSON()));
  });
}); */
app.get("/api/people", (req, res) => {
  res.json(people);
});

app.get("/api/people/:id", (req, res) => {
  const id = Number(req.params.id);
  const person = people.find((person) => person.id === id);
  if (person) {
    res.json(person);
  } else {
    res.status(404).end();
  }
});

app.delete("/api/people/:id", (request, response) => {
  const id = Number(request.params.id);
  people = people.filter((person) => person.id !== id);

  response.status(204).end();
});

app.post("/api/people", (request, response) => {
  const body = request.body;

  if (!body.name) {
    return response.status(400).json({
      error: "name missing",
    });
  }

  if (!body.number) {
    return response.status(400).json({
      error: "number missing",
    });
  }

  const personMatch = people.find((person) => person.name === body.name);

  if (personMatch) {
    return response.status(400).json({
      error: "name must be unique",
    });
  }

  const person = {
    name: body.name,
    number: body.number,
    id: Math.floor(Math.random() * 100),
  };

  people = people.concat(person);
  response.json(person);
});

const unknownEndpoint = (request, response) => {
  response.status(404).send("unknown endpoint");
};

app.use(unknownEndpoint);

const port = process.env.PORT || 3001;
app.listen(port);
console.log(`Server running on port ${process.env.PORT}; ${port}`);
