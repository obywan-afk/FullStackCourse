const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')



beforeEach(async () => {
  await Blog.deleteMany({})
  const blog = new Blog({ title: 'Test Blog', author: 'Test Author', url: 'http://example.com', likes: 1 })
  await blog.save()
})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

afterAll(() => {
  mongoose.connection.close()
})

test('blog has id property', async () => {
  const response = await api.get('/api/blogs')
  const blogs = response.body
  expect(blogs[0].id).toBeDefined()
})



test('a valid blog can be added', async () => {
  const newBlog = {
    title: 'New Blog',
    author: 'Jane Doe',
    url: 'http://example.com/new',
    likes: 10
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/blogs')
  const titles = response.body.map(blog => blog.title)

  expect(titles).toContain('New Blog')
})

test('if likes property is missing, it defaults to 0', async () => {
  const newBlog = {
    title: 'Blog Without Likes',
    author: 'Jane Doe',
    url: 'http://example.com/no-likes'
  }

  const response = await api.post('/api/blogs').send(newBlog).expect(201)

  const savedBlog = await Blog.findById(response.body.id)
  expect(savedBlog.likes).toBe(0)
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

const response = await api.get('/api/blogs')
expect(response.body).toHaveLength(1)  // Assuming 1 blog in the database initially
})


afterAll(() => {
  mongoose.connection.close()
})
