const Person = require('../models/person')
const User = require('../models/user')

const initPhonebook = [
  {
    name: 'Anna',
    number: '040-1234556',
  },
  {
    name: 'Ada Lovelace',
    number: '040-1231236',
  },
]

const nonExistingId = async () => {
  const person = new Person({ name: 'willremovethissoon', number: '11111111' })
  await person.save()
  await person.remove()

  return person._id.toString()
}

const personsInDb = async () => {
  const persons = await Person.find({})
  return persons.map((person) => person.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map((u) => u.toJSON())
}

module.exports = {
  initPhonebook,
  nonExistingId,
  personsInDb,
  usersInDb,
}
