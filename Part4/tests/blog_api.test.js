const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')

beforeEach(async () => {
  await Blog.deleteMany({})
  let blogObject = new Blog({ title: 'Sample Blog', author: 'John Doe', url: 'http://example.com', likes: 5 })
  await blogObject.save()
})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('a valid blog can be added', async () => {
  const newBlog = {
    title: 'Another Blog',
    author: 'Jane Doe',
    url: 'http://example2.com',
    likes: 7
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await Blog.find({})
  expect(blogsAtEnd).toHaveLength(2)
})

test('a blog can be deleted', async () => {
  const blogsAtStart = await Blog.find({})
  const blogToDelete = blogsAtStart[0]

  await api
    .delete(`/api/blogs/${blogToDelete.id}`)
    .expect(204)

  const blogsAtEnd = await Blog.find({})
  expect(blogsAtEnd).toHaveLength(blogsAtStart.length - 1)
})

test('a blog\'s likes can be updated', async () => {
  const blogsAtStart = await Blog.find({})
  const blogToUpdate = blogsAtStart[0]

  const updatedBlog = { ...blogToUpdate._doc, likes: 999 }

  await api
    .put(`/api/blogs/${blogToUpdate.id}`)
    .send(updatedBlog)
    .expect(200)

  const blogAtEnd = await Blog.findById(blogToUpdate.id)
  expect(blogAtEnd.likes).toBe(999)
})

test('deleting a non-existing blog returns 404', async () => {
  const invalidId = new mongoose.Types.ObjectId()

  await api
    .delete(`/api/blogs/${invalidId}`)
    .expect(404)
})

test('blog without title or url cannot be added', async () => {
  const newBlog = {
    title: '',
    url: '',
    author: 'Jane Doe'
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)
})

afterAll(() => {
  mongoose.connection.close()
})
