const User = require('../models/user')
const app = require('../app')
const supertest = require('supertest')
const helper = require('../tests/test_helper')
const bcrypt = require('bcrypt')

const api = supertest(app)

describe('creating a user', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    for(const user of helper.initialUsers){
      const { username, password, name} = user
      
      const passwordHash = await bcrypt.hash(password, 10)

      await new User({
        username: username,
        passwordHash,
        name,
      }).save()
    }
  })
  
  test('with a valid data', async () => {
    const usersAtStart = await helper.usersInDb()
    
    const newUser = {
      username: 'testuser',
      name: "Test User",
      password: 'testpassword'
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect("Content-Type",/json/)
    
    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

    const usernames = usersAtEnd.map(user => user.username)
    expect(usernames).toContain(newUser.username)
  })

  test('without username and password', async () => {
    const newUser = {
      name: "Test User",
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
  })

  test('with username that has less than 3 characters', async () => {
    const newUser = {
      username: "te",
      name: "Test User",
      password: 'testpassword'
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
  })

  test('with password that has less than 3 characters', async () => {
    const newUser = {
      username: "testuser",
      name: "Test User",
      password: 'te'
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
  })

  test('with a duplicate username', async () => {
    const newUser = {
      username: "root",
      name: "Test User",
      password: 'testuser'
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
  })
})