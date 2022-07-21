const app = require('../app')
const supertest = require('supertest')
const mongoose = require('mongoose')
const Blog = require('../models/blog')
const User = require('../models/user')
const helper = require('./test_helper')
const bcrypt = require('bcrypt')

const api = supertest(app)

beforeEach(async () => {  
  await User.deleteMany({})
  for(const user of helper.initialUsers){
    const passwordHash = await bcrypt.hash(user.password, 10)
    const userObject = new User({...user, passwordHash})
    await userObject.save()
  }
  
  await Blog.deleteMany({})
  for(const blog of helper.initialBlogs){
    const user = await User.findOne({})
    
    const blogObject = new Blog({ ...blog, user: user._id})
    await blogObject.save()
  }
})

describe('reading blogs', () => {
  test('and returns the correct amount of blogs in JSON format', async () => {
    const response = await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
    
    expect(response.body).toHaveLength(3)
  })

  test('and verifies that the unique identifier property of the blog posts is named id', async () => {
    const response = await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  
    expect(response.body[0].id).toBeDefined()
  })
})

describe('creating a blog', () => {
  test('verifies post request saves a new blog', async () => {
    const loginCreds = helper.initialUsers[0]
    
    const tokenObject = await api
      .post('/api/login')
      .send({ username: loginCreds.username, password: loginCreds.password })

    
    const newBlog = {
      title: "Test blog",
      author: "Test author",
      url: "https://medium.com",
      likes: 5,
    }
    
    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${tokenObject.body.token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)
    
    const blogs = await helper.blogsInDb()
    const titles = blogs.map(blog => blog.title)
  
    expect(blogs).toHaveLength(helper.initialBlogs.length + 1)
    expect(titles).toContain(newBlog.title)
  })

  test('verifies if the likes property is missing, it will default to the value 0', async () => {
    const loginCreds = helper.initialUsers[0]
    
    const tokenObject = await api
      .post('/api/login')
      .send({ username: loginCreds.username, password: loginCreds.password })

    const newBlog = {
      title: "Test blog",
      author: "Test author",
      url: "https://medium.com",
    }
    
    const response = await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${tokenObject.body.token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)
  
    expect(response.body.likes).toBeDefined()
    expect(response.body.likes).toEqual(0)
  })

  test('verifies that if the title and url properties are missing, respond with the status code 400', async () => {
    const loginCreds = helper.initialUsers[0]
    
    const tokenObject = await api
      .post('/api/login')
      .send({ username: loginCreds.username, password: loginCreds.password })
    
    const newBlog = {
      author: "Test author",
      likes: 0
    }
  
    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${tokenObject.body.token}`)
      .send(newBlog)
      .expect(400)
  })

  test('returns status code 401 if credentials are wrong or missing', async () => {
    const newBlog = {
      title: "Test blog",
      author: "Test author",
      url: "https://medium.com",
      likes: 5,
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(401)
  })
})

describe('deleting a blog', () => {
  test('verifies that the backend responds with the status code 204 after a successful deletion', async () => {
    const loginCreds = helper.initialUsers[0]
    
    const tokenObject = await api
      .post('/api/login')
      .send({ username: loginCreds.username, password: loginCreds.password })
  
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]
  
    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization', `Bearer ${tokenObject.body.token}`)
      .expect(204)
  
    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(blogsAtStart.length - 1)
  
    const titles = blogsAtEnd.map(blog => blog.title)
    expect(titles).not.toContain(blogToDelete.title)
  })

  test('returns status code 401 if credentials are wrong or missing', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .expect(401)
  })
})

describe('updating a blog', () => {
  test('verifies that blog gets updated with valid data', async () => {
    const loginCreds = helper.initialUsers[0]
    
    const tokenObject = await api
      .post('/api/login')
      .send({ username: loginCreds.username, password: loginCreds.password })
    
    const initialBlogs = await helper.blogsInDb()
    const blogToUpdate = initialBlogs[0]
  
    const response = await api
      .patch(`/api/blogs/${blogToUpdate.id}`)
      .set('Authorization', `Bearer ${tokenObject.body.token}`)
      .send({...blogToUpdate, likes: blogToUpdate.likes + 1})
      .expect(200)
      .expect('Content-Type', /application\/json/)
  
    expect(response.body.likes).toEqual(blogToUpdate.likes + 1)
  })

  test('verifies that backend sends status code 400 with invalid data', async () => {
    const loginCreds = helper.initialUsers[0]
    
    const tokenObject = await api
      .post('/api/login')
      .send({ username: loginCreds.username, password: loginCreds.password })
    
    const initialBlogs = await helper.blogsInDb()
    const blogToUpdate = { ...initialBlogs[0], likes: null}
  
    await api
      .patch(`/api/blogs/${blogToUpdate.id}`)
      .set('Authorization', `Bearer ${tokenObject.body.token}`)
      .send(blogToUpdate)
      .expect(400)
  })

  test('returns status code 401 if credentials are wrong or missing', async () => {
    const initialBlogs = await helper.blogsInDb()
    const blogToUpdate = initialBlogs[0]
  
    await api
      .patch(`/api/blogs/${blogToUpdate.id}`)
      .send({...blogToUpdate, likes: blogToUpdate.likes + 1})
      .expect(401)
  })
})

afterAll(() => {
  mongoose.connection.close()
})