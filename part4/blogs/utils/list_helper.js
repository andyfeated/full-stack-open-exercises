const _ = require('lodash')

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return total = blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
  if(!blogs.length){
    return {}
  }

  const favorite =  blogs.reduce((max, blog) => {
    if(max.likes < blog.likes){
      return blog
    }

    return max
  }, {likes: 0})

  return favorite
}

const mostBlogs = (blogs) => {
  if(!blogs.length){
    return {}
  }
  
  const blogsByAuthor = _.groupBy(blogs, 'author')
  
  const mappedBlogs = []

  _.forOwn(blogsByAuthor, (value, key) => {
    mappedBlogs.push({
      author: key,
      blogs: value.length,
    })
  })

  const mostBlogs = mappedBlogs.reduce((max, blog) => {
    if(max.blogs < blog.blogs){
      return blog
    }

    return max
  }, { blogs: 0 })

  return mostBlogs  
}

const mostLikes = (blogs) => {
  if(!blogs.length){
    return {}
  }

  const blogsByAuthor = _.groupBy(blogs, 'author')

  const mappedBlogs = []

  _.forOwn(blogsByAuthor, (val, key) => {
    const likes = val.reduce((sum, blog) => sum + blog.likes, 0)
    
    mappedBlogs.push({
      author: key,
      likes,
    })
  })

  const mostLikes = mappedBlogs.reduce((max, blog) => {
    if(max.likes < blog.likes){
      return blog
    }

    return max
  }, { likes: 0})

  return mostLikes
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}