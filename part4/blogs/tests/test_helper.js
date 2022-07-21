const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [
  {
    title: "How I code for 8 hours without feeling tired.",
    author: "Amir Diafi",
    url: "https://medium.com/@amirdiafi/how-i-code-for-8-hours-without-feeling-tired-3d2b22f917af",
    likes: 4,
  },
  {
    title: "The JavaScript framework war is over",
    author: "David Rodenas, Ph. D.",
    url: "https://medium.com/codex/the-javascript-framework-war-is-over-bd110ddab732",
    likes: 3,
  },
  {
    title: "5 Javascript Clean Coding Patterns To Enhance your Code",
    author: "Daniel Guedes",
    url: "https://medium.com/arionkoder-engineering/5-javascript-clean-coding-patterns-to-enhance-your-code-cc205d8d1ab6",
    likes: 6,
  }
]

const initialUsers = [
  {
    username: "root",
    name: "Superuser",
    password: "admin",
  },
  {
    username: "andybanua30",
    name: "Andy Banua",
    password: "mitchaybanua30",
  }
]

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(user => user.toJSON())
}

module.exports = {
  initialBlogs,
  initialUsers,
  blogsInDb,
  usersInDb
}