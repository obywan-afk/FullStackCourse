const dummy = (blogs) => {
    return 1
  }
  
  
  const totalLikes = (blogs) => {
    return blogs.reduce((sum, blog) => sum + blog.likes, 0)
  }
  
  const favoriteBlog = (blogs) => {
    if (blogs.length === 0) return null
  
    const favorite = blogs.reduce((fav, blog) => {
      return blog.likes > fav.likes ? blog : fav
    })
  
    return {
      title: favorite.title,
      author: favorite.author,
      likes: favorite.likes
    }
  }
  
  const _ = require('lodash')

const mostBlogs = (blogs) => {
  const authorCounts = _.countBy(blogs, 'author')
  const maxAuthor = _.maxBy(Object.keys(authorCounts), (author) => authorCounts[author])
  return { author: maxAuthor, blogs: authorCounts[maxAuthor] }
}

const mostLikes = (blogs) => {
    const likesByAuthor = blogs.reduce((acc, blog) => {
      acc[blog.author] = (acc[blog.author] || 0) + blog.likes
      return acc
    }, {})
  
    const maxAuthor = Object.keys(likesByAuthor).reduce((a, b) => (likesByAuthor[a] > likesByAuthor[b] ? a : b))
  
    return { author: maxAuthor, likes: likesByAuthor[maxAuthor] }
  }
  
  
  
  module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
  }
  