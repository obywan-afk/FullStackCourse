// tests/blog_api.test.js

const mongoose = require('mongoose');
const supertest = require('supertest');
const bcrypt = require('bcrypt');
const app = require('../app');
const api = supertest(app);
const Blog = require('../models/blog');
const User = require('../models/user');
const jwt = require('jsonwebtoken');


let token;

// beforeEach(async () => {
//   // Clear the database
//   await User.deleteMany({});
//   await Blog.deleteMany({});

//   // Create a test user
//   const passwordHash = await bcrypt.hash('testpassword', 10);
//   const user = new User({ username: 'testuser', passwordHash });
//   await user.save();

//   // Log in to get a valid token
//   const loginResponse = await api
//     .post('/api/login')
//     .send({ username: 'testuser', password: 'testpassword' });

//   token = loginResponse.body.token;

//   // Create a test blog associated with the user
//   const blog = new Blog({
//     title: 'Test Blog',
//     author: 'Test Author',
//     url: 'http://example.com',
//     likes: 1,
//     user: user._id,
//   });
//   await blog.save();
// });



beforeEach(async () => {
  await User.deleteMany({});
  await Blog.deleteMany({});

  // Create a test user
  const passwordHash = await bcrypt.hash('testpassword', 10);
  const user = new User({ username: 'testuser', passwordHash });
  await user.save();

  // Log in to get a valid token
  const loginResponse = await api
    .post('/api/login')
    .send({ username: 'testuser', password: 'testpassword' });

  token = loginResponse.body.token;

  // Create a test blog associated with the same user
  const newBlog = {
    title: 'Test Blog',
    author: 'Test Author',
    url: 'http://example.com',
    likes: 1,
  };

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`) // Use the same token to associate blog with user
    .send(newBlog);
});









describe('Blog API tests', () => {
  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .set('Authorization', `Bearer ${token}`) // Added Authorization header
      .expect(200)
      .expect('Content-Type', /application\/json/);
  });

  test('a valid blog can be added', async () => {
    const newBlog = {
      title: 'New Blog',
      author: 'Jane Doe',
      url: 'http://example.com/new',
      likes: 10,
    };

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`) // Correctly set the Authorization header
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const response = await api
      .get('/api/blogs')
      .set('Authorization', `Bearer ${token}`); // Added Authorization header

    expect(response.body).toHaveLength(2);

    const titles = response.body.map((b) => b.title);
    expect(titles).toContain('New Blog');
  });

  test('adding a blog fails with 401 Unauthorized if token is not provided', async () => {
    const newBlog = {
      title: 'Unauthorized Blog',
      author: 'Jane Doe',
      url: 'http://example.com/unauthorized',
      likes: 5,
    };

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(401) // Expecting 401 Unauthorized
      .expect('Content-Type', /application\/json/);

    const response = await api
      .get('/api/blogs')
      .set('Authorization', `Bearer ${token}`); // Added Authorization header

    expect(response.body).toHaveLength(1); // Only the initial blog exists
  });

  test('if likes property is missing, it defaults to 0', async () => {
    const newBlog = {
      title: 'Blog Without Likes',
      author: 'Jane Doe',
      url: 'http://example.com/no-likes',
    };

    const response = await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`) // Correctly set the Authorization header
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const savedBlog = await Blog.findById(response.body.id);
    expect(savedBlog.likes).toBe(0);
  });








// <
//   test('a blog can be deleted', async () => {
//     console.log('Starting delete test...');
  
//     const blogsAtStart = await Blog.find({});
//     console.log('Blogs at start:', blogsAtStart);
    
//     const blogToDelete = blogsAtStart[0];
//     console.log('Blog to delete:', blogToDelete);
  
//     const decodedToken = jwt.verify(token, process.env.SECRET);
//     console.error('Decoded token:', decodedToken);
    
//     await api
//       .delete(`/api/blogs/${blogToDelete.id}`)
//       .set('Authorization', `Bearer ${token}`)
//       .expect(204);
  
//     const blogsAtEnd = await Blog.find({});
//     console.error('Blogs at end:', blogsAtEnd);
//   });
  

  test('a blog can be deleted', async () => {
    console.error('Starting delete test...');

    const blogsAtStart = await Blog.find({});
    console.error('Blogs at start:', blogsAtStart);

    const blogToDelete = blogsAtStart[0];
    console.error('Blog to delete:', blogToDelete);

  
    // Check that the blog and its user are correct
    console.error('Blog to delete:', blogToDelete);
    console.error('Blog user ID:', blogToDelete.user.toString());
  
    const decodedToken = jwt.verify(token, process.env.SECRET);
    console.error('Token user ID:', decodedToken.id);
    console.error('Decoded token:', decodedToken);

    const response = await api
    .delete(`/api/blogs/${blogToDelete.id}`)
    .set('Authorization', `Bearer ${token}`)
    .expect((res) => {
      if (res.status !== 204) {
        console.error('Delete blog failed:', res.body); // Log the response body on failure
      }
    })
    .expect(204);

    const blogsAtEnd = await Blog.find({});
    console.error('Blogs at end:', blogsAtEnd);

    expect(blogsAtEnd).toHaveLength(blogsAtStart.length - 1);
  
    const titles = blogsAtEnd.map((b) => b.title);
    expect(titles).not.toContain(blogToDelete.title);
  });
  








  // describe('deletion of a blog', () => {
  //   test('a valid blog cannot be deleted without a token', async () => {
  //     const blogsBeforeDelete = await helper.blogsInDb()
  //     const blogToDelete = blogsBeforeDelete[0]
  
  //     await api
  //       .delete(`/api/blogs/${blogToDelete.id}`)
  //       .expect(401)
  
  //     const blogsAfterDelete = await helper.blogsInDb()
  //     const blogIdsInDb = blogsAfterDelete.map(r => r.id)
  
  //     expect(blogsAfterDelete).toHaveLength(helper.initialBlogs.length)
  //     expect(blogIdsInDb).toContain(blogToDelete.id)
  
  //     const usersAfterDelete = await helper.usersInDb()
  //     const user = usersAfterDelete.find((user) => user.id === helper.initialUser._id)
  //     expect(user.blogs.map(blog => blog.toString())).toContain(blogToDelete.id)
  //   })
  
  //   test('a valid blog cannot be deleted with an invalid token', async () => {
  //     const blogsBeforeDelete = await helper.blogsInDb()
  //     const blogToDelete = blogsBeforeDelete[0]
  
  //     await api
  //       .delete(`/api/blogs/${blogToDelete.id}`)
  //       .set('authorization', 'Bearer aaaaaaaaaaaa')
  //       .expect(401)
  
  //     const blogsAfterDelete = await helper.blogsInDb()
  //     const blogIdsInDb = blogsAfterDelete.map(r => r.id)
  
  //     expect(blogsAfterDelete).toHaveLength(helper.initialBlogs.length)
  //     expect(blogIdsInDb).toContain(blogToDelete.id)
  
  //     const usersAfterDelete = await helper.usersInDb()
  //     const user = usersAfterDelete.find((user) => user.id === helper.initialUser._id)
  //     expect(user.blogs.map(blog => blog.toString())).toContain(blogToDelete.id)
  //   })
  
  //   test('succeeds with status code 204 if id is valid', async () => {
  //     const blogsBeforeDelete = await helper.blogsInDb()
  //     const blogToDelete = blogsBeforeDelete[0]
  
  //     await api
  //       .delete(`/api/blogs/${blogToDelete.id}`)
  //       .set('authorization', token)
  //       .expect(204)
  
  //     const blogsAfterDelete = await helper.blogsInDb()
  //     const blogIdsInDb = blogsAfterDelete.map(r => r.id)
  
  //     expect(blogsAfterDelete).toHaveLength(helper.initialBlogs.length - 1)
  //     expect(blogIdsInDb).not.toContain(blogToDelete.id)
  
  //     const usersAfterDelete = await helper.usersInDb()
  //     const user = usersAfterDelete.find((user) => user.id === helper.initialUser._id)
  //     expect(user.blogs.map(blog => blog.toString())).not.toContain(blogToDelete.id)
  //   })
  // })




















  test("a blog's likes can be updated", async () => {
    const blogsAtStart = await Blog.find({});
    const blogToUpdate = blogsAtStart[0];

    const updatedBlog = { ...blogToUpdate.toJSON(), likes: 999 };

    const response = await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .set('Authorization', `Bearer ${token}`) // Added Authorization header
      .send(updatedBlog)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    const blogAtEnd = await Blog.findById(blogToUpdate.id);
    expect(blogAtEnd.likes).toBe(999);
  });

  test('deleting a non-existing blog returns 404', async () => {
    const invalidId = new mongoose.Types.ObjectId();

    await api
      .delete(`/api/blogs/${invalidId}`)
      .set('Authorization', `Bearer ${token}`) // Correctly set the Authorization header
      .expect(404);
  });

  test('blog without title or url cannot be added', async () => {
    const newBlog = {
      title: '',
      url: '',
      author: 'Jane Doe',
    };

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`) // Correctly set the Authorization header
      .send(newBlog)
      .expect(400);

    const response = await api
      .get('/api/blogs')
      .set('Authorization', `Bearer ${token}`); // Added Authorization header

    expect(response.body).toHaveLength(1); // Only the initial blog exists
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});
