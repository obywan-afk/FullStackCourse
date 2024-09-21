// tests/blog_api.test.js

const mongoose = require('mongoose')
const supertest = require('supertest')
const bcrypt = require('bcrypt')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const config = require('../utils/config')

let token

beforeEach(async () => {
  await User.deleteMany({})
  await Blog.deleteMany({})

  const passwordHash = await bcrypt.hash('testpassword', 10)
  const user = new User({ username: 'testuser', passwordHash })
  await user.save()

  const userForToken = { username: user.username, id: user._id }
  token = jwt.sign(userForToken, config.SECRET, { expiresIn: '1h' })

  const blog = new Blog({
    title: 'Test Blog',
    author: 'Test Author',
    url: 'http://example.com',
    likes: 1,
    user: user._id,
  })
  await blog.save()
})

describe('Blog API tests', () => {
  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('a valid blog can be added', async () => {
    const newBlog = {
      title: 'New Blog',
      author: 'Jane Doe',
      url: 'http://example.com/new',
      likes: 10,
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`) // Correctly set the Authorization header
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')
    expect(response.body).toHaveLength(2)

    const titles = response.body.map(b => b.title)
    expect(titles).toContain('New Blog')
  })

  test('adding a blog fails with 401 Unauthorized if token is not provided', async () => {
    const newBlog = {
      title: 'Unauthorized Blog',
      author: 'Jane Doe',
      url: 'http://example.com/unauthorized',
      likes: 5,
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(401) // Expecting 401 Unauthorized
      .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')
    expect(response.body).toHaveLength(1) // Only the initial blog exists
  })

  test('if likes property is missing, it defaults to 0', async () => {
    const newBlog = {
      title: 'Blog Without Likes',
      author: 'Jane Doe',
      url: 'http://example.com/no-likes',
    }

    const response = await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`) // Correctly set the Authorization header
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const savedBlog = await Blog.findById(response.body.id)
    expect(savedBlog.likes).toBe(0)
  })

  test('a blog can be deleted', async () => {
    const blogsAtStart = await Blog.find({})
    const blogToDelete = blogsAtStart[0]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization', `Bearer ${token}`) // Correctly set the Authorization header
      .expect(204)

    const blogsAtEnd = await Blog.find({})
    expect(blogsAtEnd).toHaveLength(blogsAtStart.length - 1)

    const titles = blogsAtEnd.map(b => b.title)
    expect(titles).not.toContain(blogToDelete.title)
  })

  test("a blog's likes can be updated", async () => {
    const blogsAtStart = await Blog.find({})
    const blogToUpdate = blogsAtStart[0]

    const updatedBlog = { ...blogToUpdate._doc, likes: 999 }

    const response = await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(updatedBlog)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const blogAtEnd = await Blog.findById(blogToUpdate.id)
    expect(blogAtEnd.likes).toBe(999)
  })

  test('deleting a non-existing blog returns 404', async () => {
    const invalidId = new mongoose.Types.ObjectId()

    await api
      .delete(`/api/blogs/${invalidId}`)
      .set('Authorization', `Bearer ${token}`) // Correctly set the Authorization header
      .expect(404)
  })

  test('blog without title or url cannot be added', async () => {
    const newBlog = {
      title: '',
      url: '',
      author: 'Jane Doe',
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`) // Correctly set the Authorization header
      .send(newBlog)
      .expect(400)

    const response = await api.get('/api/blogs')
    expect(response.body).toHaveLength(1) // Only the initial blog exists
  })
})

afterAll(() => {
  mongoose.connection.close()
})
