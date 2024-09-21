// app.js
const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const logger = require('./utils/logger')
const config = require('./utils/config')
const middleware = require('./utils/middleware')
const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')

// Connect to MongoDB
mongoose.set('strictQuery', false)
logger.info('connecting to', config.MONGODB_URI)

mongoose.connect(config.MONGODB_URI)
  .then(() => {
    logger.info('connected to MongoDB')
  })
  .catch((error) => {
    logger.error('error connecting to MongoDB:', error.message)
  })

// Apply Middlewares
app.use(cors())
app.use(express.static('build'))
app.use(express.json())

// Token Extraction Middleware (must come before routes that need token)
app.use(middleware.tokenExtractor)

// Routes that require user extraction
app.use('/api/blogs', middleware.userExtractor, blogsRouter)

// Routes that do not require authentication
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)

// Error Handling Middlewares (must come after all routes)
app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app
