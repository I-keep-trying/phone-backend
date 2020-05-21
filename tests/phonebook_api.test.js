const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
require('dotenv').config()
const config = require('../utils/config')
const app = require('../app')

const api = supertest(app)
console.log('NODE_ENV: ', process.env.NODE_ENV, 'URI: ', config.MONGODB_URI)

const Person = require('../models/person')
const bcrypt = require('bcrypt')
const User = require('../models/user')

beforeEach(async () => {
  await Person.deleteMany({})

  const personObjects = helper.initPhonebook.map((person) => new Person(person))
  const promiseArray = personObjects.map((person) => person.save())
  await Promise.all(promiseArray)
})

/* test('phonebook data are returned as json', async () => {
  await api
    .get('/api/persons')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('phonebook data contains id field', async () => {
  const response = await api.get('/api/persons')
  console.log('response.status', response.status)
  expect(response.body[0].id).toBeDefined()
})

test('there are two entries', async () => {
  const response = await api.get('/api/persons')

  expect(response.body).toHaveLength(2)
})

test('the first entry name is Anna', async () => {
  const response = await api.get('/api/persons')

  expect(response.body[0].name).toBe('Anna')
})

test('all entries are returned', async () => {
  const response = await api.get('/api/persons')
  expect(response.body).toHaveLength(helper.initPhonebook.length)
})

test('a specific name is within the returned entries', async () => {
  const response = await api.get('/api/persons')

  const contents = response.body.map((r) => r.name)

  expect(contents).toContain('Ada Lovelace')
})

test('a valid entry can be added', async () => {
  const newPerson = {
    name: 'Testy McTestface',
    number: '12123456',
  }

  await api
    .post('/api/persons')
    .send(newPerson)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  const response = await helper.personsInDb()
  expect(response).toHaveLength(helper.initPhonebook.length + 1)

  const contents = response.map((r) => r.name)
  expect(contents).toContain('Testy McTestface')
})

test('entry without name is not added', async () => {
  const newPerson = {
    number: '66666666',
  }

  await api.post('/api/persons').send(newPerson).expect(400)

  const response = await helper.personsInDb()

  expect(response).toHaveLength(helper.initPhonebook.length)
})

test('a specific entry can be viewed', async () => {
  const entriesAtStart = await helper.personsInDb()

  const personToView = entriesAtStart[0]

  const resultPerson = await api
    .get(`/api/persons/${personToView.id}`)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  expect(resultPerson.body).toEqual(personToView)
})

test('an entry can be deleted', async () => {
  const entriesAtStart = await helper.personsInDb()
  const personToDelete = entriesAtStart[0]

  await api.delete(`/api/persons/${personToDelete.id}`).expect(204)

  const entriesAtEnd = await helper.personsInDb()

  expect(entriesAtEnd).toHaveLength(helper.initPhonebook.length - 1)

  const names = entriesAtEnd.map((r) => r.name)

  expect(names).not.toContain(personToDelete.name)
}) */

//tests for user records

describe('when there is initially one user in db', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', passwordHash })

    await user.save()
  })

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      password: 'salainen',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

    const usernames = usersAtEnd.map((u) => u.username)
    expect(usernames).toContain(newUser.username)
  })
})

afterAll(() => {
  mongoose.connection.close()
})
