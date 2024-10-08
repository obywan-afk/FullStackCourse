const blogsRouter = require('express').Router()
const Blog = require('../models/blog')  
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const config = require('../utils/config')
const express = require('express');
const middleware = require('../utils/middleware')



blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs)
})


blogsRouter.post('/', async (request, response, next) => {
  try {
    const body = request.body
    const user = request.user

    if (!user) {
      return response.status(401).json({ error: 'user not authenticated' })
    }

    const blog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes || 0,
      user: user._id,
    })

    const savedBlog = await blog.save()
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()

    response.status(201).json(savedBlog)
  } catch (error) {
    next(error)
  }
})


blogsRouter.delete('/:id', async (request, response, next) => {
  const user = request.user;

  try {
    console.log('Trying to delete blog with ID:', request.params.id);

    const blog = await Blog.findById(request.params.id);
    console.log('Blog found:', blog);


    if (!blog) {
      console.log('Blog not found');

      return response.status(404).json({ error: 'blog not found' });
    }
    console.log('Blog user ID:', blog.user.toString());
    console.log('Authenticated user ID:', user._id.toString());

    if (blog.user.toString() !== user._id.toString()) {
      console.log('Unauthorized deletion attempt');

      return response.status(401).json({ error: 'unauthorized user' });
    }

    await Blog.findByIdAndDelete(request.params.id);
    console.log('Blog successfully deleted');

    response.status(204).end();
  } catch (error) {
    console.log('Error in delete operation:', error.message);

    next(error);
  }
});













blogsRouter.put('/:id', async (request, response, next) => {
  const { title, author, url, likes } = request.body

  const updatedBlogData = {
    title,
    author,
    url,
    likes,
  }

  try {
    const updatedBlog = await Blog.findByIdAndUpdate(
      request.params.id,
      updatedBlogData,
      { new: true, runValidators: true, context: 'query' }
    )
    response.json(updatedBlog)
  } catch (error) {
    next(error)
  }
})

module.exports = blogsRouter







