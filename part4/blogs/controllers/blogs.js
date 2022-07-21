const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const middleware = require('../utils/middleware')

blogsRouter.get('/', async (req, res) => {
  const blogs = await Blog.find({}).populate('user')
  res.json(blogs)
})

blogsRouter.post('/',  middleware.userExtractor, async (req, res, next) => {
  const user = req.user
  
  if(!req.body.url || !req.body.title){
    return res.status(400).json({error: 'title and url are missing'})
  }

  try{
    const blog = new Blog({
      ...req.body,
      user: user._id
    })
    const savedBlog = await blog.save()

    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()

    res.status(201).json(blog)
  } catch(err) {
    next(err)
  }
})

blogsRouter.delete('/:id', middleware.userExtractor, async (req, res, next) => {
  const id = req.params.id
  
  try{
    const decodedToken = jwt.verify(req.token, process.env.SECRET)
    const blog = await Blog.findById(id)

    if(decodedToken.id.toString() !== blog.user.toString()){
      return res.send(401).json({ error: 'token is invalid or missing'})
    }

    const user = req.user
    user.blogs = user.blogs.filter(blog => blog._id.toString() !== id)

    await user.save()
    await Blog.findByIdAndRemove(id)
    res.send(204)
  }catch(err){
    next(err)
  }
})

blogsRouter.patch('/:id', middleware.userExtractor, async (req,res,next) => {
  const id = req.params.id
  const likes = req.body.likes
  
  try{
    const decodedToken = jwt.verify(req.token, process.env.SECRET)
    const blog = await Blog.findById(id)

    if(decodedToken.id.toString() !== blog.user.toString()){
      return res.send(401).json({ error: 'token is invalid or missing'})
    }

    if(likes){
      const updateBlog = await Blog.findByIdAndUpdate(id, { likes }, { new: true, context: 'query'})
      res.status(200).json(updateBlog)
    }else{
      res.status(400).json({ error: "likes parameter is missing"})
    }
  }catch(err){
    next(err)
  }
})

module.exports = blogsRouter