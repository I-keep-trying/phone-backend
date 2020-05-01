require('dotenv').config()
const app = require('./app')
const http = require('http')
const config = require('./utils/config')
const logger = require('./utils/logger')

const url = config.MONGODB_URI

const server = http.createServer(app)

const PORT = config.PORT
const ENV = process.env.NODE_ENV
server.listen(PORT, () => {
  logger.info(
    `Server running on port ${PORT} on ${ENV} environment, url: ${url}`
  )
})
