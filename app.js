const config = require('./utils/config')
const express = require('express')
require('express-async-errors')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const blogsRoute = require('./controllers/blogs')
const userRoute = require('./controllers/users')
const loginRoute = require('./controllers/login')
const middleware = require('./utils/middlewares')
const logger = require('./utils/logger')

mongoose.connect(config.MONGODB_URI).then(()=>{
	logger.info('Connected to mongoDB')
})
.catch(error => logger.error(`Failed to connect to mongoDB ${error.message}`))

app.use(cors())
app.use(express.json())
app.use(middleware.requestLogger)

app.use('/api/blogs', blogsRoute)
app.use('/api/users', userRoute)
app.use('/api/login', loginRoute)

app.use(middleware.unknowEndpoint)
app.use(middleware.errorHandler)

module.exports = app