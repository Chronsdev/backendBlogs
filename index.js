const config = require('./utils/config.js')
const http = require('http')
const app = require('./app')
const logger = require('./utils/logger.js')

const server = http.createServer(app)

server.listen(config.PORT, ()=>{
	logger.info(`The server is now running on port ${config.PORT}`)
})