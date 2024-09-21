const logger = require('./logger')
const jwt = require('jsonwebtoken')
const User = require('../models/user')
const config = require('./config')

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
    logger.error('Error:', error.message)
  
    if (error.name === 'CastError') {
      return response.status(400).send({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError') {
      return response.status(400).json({ error: error.message })
    } else if (error.name === 'JsonWebTokenError') {
      return response.status(401).json({ error: 'invalid token' })
    }
  
    next(error)
  }
  
const tokenExtractor = (request, response, next) => {
    const authorization = request.get('authorization')
    if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
      request.token = authorization.substring(7)
      logger.info('Token extracted:', request.token)
    } else {
      request.token = null
      logger.info('No token found in Authorization header')
    }
    next()
  }
  
  const userExtractor = async (request, response, next) => {
    try {
      const token = request.token
      logger.info('UserExtractor: Received token:', token)
  
      if (!token) {
        logger.error('UserExtractor: Token missing')
        return response.status(401).json({ error: 'token missing' })
      }
  
      const decodedToken = jwt.verify(token, config.SECRET)
      logger.info('UserExtractor: Decoded token:', decodedToken)
  
      if (!decodedToken.id) {
        logger.error('UserExtractor: Token invalid, no id found')
        return response.status(401).json({ error: 'token invalid' })
      }
  
      const user = await User.findById(decodedToken.id)
      logger.info('UserExtractor: User found:', user)
  
      if (!user) {
        logger.error('UserExtractor: User not found')
        return response.status(401).json({ error: 'user not found' })
      }
  
      request.user = user
      next()
    } catch (error) {
      logger.error('UserExtractor: Error occurred:', error.message)
      next(error)
    }
  }
  

module.exports = {
  unknownEndpoint,
  errorHandler,
  tokenExtractor,
  userExtractor
}
