const mongoose = require('mongoose')
const supertest = require('supertest')
require('dotenv').config()
const config = require('../utils/config')
const app = require('../index')

const api = supertest(app)
console.log('NODE_ENV: ', process.env.NODE_ENV, 'URI: ', config.MONGODB_URI)
console.log('api', api.connect)
afterAll(() => {
  mongoose.connection.close()
  // api.close()
})

test('phonebook data are returned as json', async () => {
  await api
    .get('/api/persons')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})
