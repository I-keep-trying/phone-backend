const phoneRouter = require('express').Router()
const Person = require('../models/person')

console.log('phoneRouter', phoneRouter)

phoneRouter.get('/api/persons', async (req, res) => {
  const persons = await Person.find({})
  res.json(persons.map((person) => person.toJSON()))
})

phoneRouter.get('/api/info', async (req, res) => {
  const persons = await Person.find({})
  res.send(`
    <h3>There are ${persons.length} people in the phonebook. </h3>
    <div>${new Date()} </div>
    `)
})

phoneRouter.get('/api/persons/:id', async (request, response) => {
  const person = await Person.findById(request.params.id)
  if (person) {
    response.json(person.toJSON())
  } else {
    response.status(404).end()
  }
})

phoneRouter.post('/api/persons/', async (request, response) => {
  const body = request.body

  if (!body.name) {
    return response.status(400).json({
      error: 'name missing',
    })
  }

  if (!body.number) {
    return response.status(400).json({
      error: 'number missing',
    })
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  })
  const savedPerson = await person.save()
  response.json(savedPerson.toJSON())
})

phoneRouter.delete('/api/persons/:id', async (request, response) => {
  await Person.findByIdAndRemove(request.params.id)
  response.status(204).end()
})

phoneRouter.put('/api/persons/:id', (request, response, next) => {
  const body = request.body

  const person = {
    name: body.name,
    number: body.number,
  }

  Person.findByIdAndUpdate(request.params.id, person, { new: true })
    .then((updatedPerson) => {
      console.log(request.params)
      response.json(updatedPerson.toJSON())
    })
    .catch((error) => next(error))
})

module.exports = phoneRouter
