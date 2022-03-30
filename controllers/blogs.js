const jwt = require('jsonwebtoken')
const config = require('../utils/config')
const blogsRoute = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const logger = require('../utils/logger')

blogsRoute.get('/', async (req, res)=>{
	const blogs = await Blog
	.find({}).populate('user', { username: 1, name: 1 })
	res.json(blogs)
})

blogsRoute.get('/:id', async (req, res) => {
	const blog = await Blog.findById(req.params.id)
	if (blog) {
		res.json(blog)
	} else { 
		res.status(404).end()
	}
})

const getTokenFrom = req => {
	const authorization = req.get('authorization')
	if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
		return authorization.substring(7)
	}
	return null
}


blogsRoute.post('/', async (req, res)=>{
	const body = req.body
	const token = getTokenFrom(req)
	const decodedToken = jwt.verify(token, config.SECRET)
	if (!token | !decodedToken.id) {
		return res.status(401).json({error: 'token missing or invalid'})
	}
	const user = await User.findById(decodedToken.id)

	const blog = new Blog ({
		title: body.title,
		author: body.author,
		url: body.url,
		likes: body.likes || 0,
		user: user._id
	})

	const savedBlog = await blog.save()
	user.blogs = user.blogs.concat(savedBlog._id)
	await user.save()

	res.json(savedBlog)

})
 
blogsRoute.delete('/:id', async (req, res)=>{
		const id = req.params.id
		const token = getTokenFrom(req)
		const decodedToken = jwt.verify(token, config.SECRET)
		if (!token | !decodedToken.id) {
			return res.status(401).json({error: 'token missing or invalid'})
		}

		const blog = await Blog.findById(id)

		if (blog.user.toString() === decodedToken.id.toString()) {
			await Blog.findByIdAndRemove(id)
			res.status(204).end()
		} else {
			res.status(400).json({
				error: 'The blog you try to delete is not from this user'
			})
		}
		
})

blogsRoute.put('/:id', async (req, res) => {
	const { body } = req

	const blog = {
		title: body.title,
		author: body.author,
		url: body.url,
		likes: body.likes
	}

	const updateBlog = await Blog.findByIdAndUpdate(req.params.id, blog, { new: true })
	logger.info(`blog ${blog.title} successfully updated`)
	res.json(updateBlog)

})
 
module.exports = blogsRoute