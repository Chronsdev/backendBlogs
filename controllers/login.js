const config = require('../utils/config')
const loginRoute = require('express').Router()
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const User = require('../models/user')

loginRoute.post('/', async (req, res) => {
	const {body} = req

	const user = await User.findOne({username: body.username})
	const passwordCorrect = user === null
	? false
	: await bcrypt.compare(body.password, user.passwordHash)

	if (!(user && passwordCorrect)) {
		return res.status(401).end({error: 'the username or password are invalid'})
	}

	const tokenInform = {
		username: user.username,
		id: user._id
	}

	const token = jwt.sign(tokenInform, config.SECRET)

	res.status(200).send({
		token, username: user.username, name: user.name
	})
})

module.exports = loginRoute