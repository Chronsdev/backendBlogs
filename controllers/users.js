const bcrypt = require('bcrypt')
const userRoute = require('express').Router()
const User = require('../models/user.js')

userRoute.get('/', async (req, res) => {
	const users = await User
	.find({}).populate('blogs', { title: 1, author: 1 })
	res.json(users)
})

userRoute.post('/', async (req, res) => {
	const {body} = req

	const saltRounds = 10
    const passwordHash = await bcrypt.hash(body.password, saltRounds)

	user = new User({
		username: body.username,
		name: body.name,
		passwordHash
	})

	const savedUser = await user.save()

	res.json(savedUser)
})
   
userRoute.delete('/:id', async (req, res) => {
	await User.findByIdAndRemove(req.params.id)
	res.status(204).end()
})

module.exports = userRoute