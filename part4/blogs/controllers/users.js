const usersRouter = require('express').Router()
const bcrypt = require('bcrypt')
const User = require('../models/user')

usersRouter.get('/', async (req, res) => {
  const users = await User.find({})

  res.status(200).json(users)
})

usersRouter.post('/', async (req, res) => {
  const { username, password, name } = req.body

  if(!username || !password){
    return res.status(400).json({ error: 'username and password are both required'})
  }

  if(username.length < 3){
    return res.status(400).json({ error: 'username must be atleast 3 characters long'})
  }

  if(password.length < 3){
    return res.status(400).json({ error: 'password must be atleast 3 characters long'})
  }

  const existingUser = await User.findOne({ username })
  if(existingUser){
    return res.status(400).json({ error: 'username must be unique'})
  }

  const passwordHash = await bcrypt.hash(password, 10)

  const user = new User({
    name,
    username,
    passwordHash
  })

  const savedUser = await user.save()

  res.status(201).json(savedUser)
})

module.exports = usersRouter