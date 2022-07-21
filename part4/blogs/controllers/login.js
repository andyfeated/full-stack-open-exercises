const loginRouter = require('express').Router()
const bcrypt = require('bcrypt')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

loginRouter.post('/', async (req, res) => {
  const { username, password } = req.body

  const user = await User.findOne({ username })
  const passwordCorrect = !user ? false : bcrypt.compare(password, user.passwordHash)

  if(!(user && passwordCorrect)){
    return res.status(201).json({ error: 'invalid username or password'})
  }

  const userForToken = {
    username: user.username,
    id: user._id
  }

  const token = jwt.sign(userForToken, process.env.SECRET)

  res.status(200).json({ token,  username: user.username, name: username.name})
})

module.exports = loginRouter