require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");

mongoose.set("useFindAndModify", false);

mongoose.connect(process.env.MONGODB_URI, {
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

const Person = mongoose.model("Person", personSchema);

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

/* let persons = [
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
]; */

app.get("/", (req, res) => {
  res.send("<h1>Hello World!</h1>");
});

/* app.get("/api/info", (req, res) => {
  res.send(`
  <h3>There are ${persons.length} persons in the phonebook. </h3>
  <div>${new Date()} </div>
  `);
}); */

app.get("/api/persons", (req, res) => {
  Person.find({}).then((persons) => {
    res.json(persons.map((person) => person.toJSON()));
  });
});

app.get("/api/persons/:id", (req, res) => {
  Person.findById(req.params.id)
    .then((person) => {
      if (person) {
        res.json(person.toJSON());
      } else {
        res.status(404).end();
      }
    })
    .catch((error) => {
      console.log(error);
      res.status(400).send({ error: "malformatted id" });
    });
});

app.delete("/api/persons/:id", (request, response) => {
  Person.findByIdAndRemove(request.params.id)
    .then((result) => {
      response.status(204).end();
    })
    .catch((error) => {
      console.log(error);
      response.status(400).send({ error: "something went wrong" });
    });
});

app.post("/api/persons", (request, response) => {
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

  /*   Person.findByName(request.params.name).then(person => {
      if (person) {
          response
      }
  });

  if (personMatch) {
    return response.status(400).json({
      error: "name must be unique",
    });
  } */

  const person = new Person({
    name: body.name,
    number: body.number,
  });

  person.save().then((savedPerson) => {
    console.log("request.params", request.params);
    response.json(savedPerson.toJSON());
  });
});

const unknownEndpoint = (request, response) => {
  response.status(404).send("unknown endpoint");
};

app.use(unknownEndpoint);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
