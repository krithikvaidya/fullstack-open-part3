
require('dotenv').config()

const Person = require('./models/person')

const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const app = express ()

morgan.token('body', req => {
	return req.method === 'POST' ? JSON.stringify(req.body) : null
})

app.use (cors())
app.use (morgan(':method :url :status :res[content-length] - :response-time ms :body'))
app.use (express.json())
app.use (express.static('build'))


app.get ('/api/persons', (req, res) => {

	Person
		.find ({})
		.then (people => {
			res.json (people)
		})
		.catch(error => {
			console.log(error)
			res.status(500).end()
		})
})

app.get ('/api/persons/:id', (req, res, next) => {

	const id = req.params.id

	console.log (id)

	Person
		.findById (id)
		.then (person => {
			if (person) {
				res.json (person)
			}
			else {
				res.status(404).end()
			}

		})
		.catch(error => next (error))


})

app.delete ('/api/persons/:id', (req, res, next) => {

	const id = req.params.id

	Person
		.findByIdAndRemove (id)
		.then (() => {

			res.status(204).end()

		})
		.catch (err => next (err))

})

app.get ('/info', (req, res, next) => {

	Person
		.count({})
		.then (record_count => {

			const date_time = new Date

			res.send (`
				<p>Phonebook has info for ${record_count} people</p>
				<p>${date_time}</p>
			`)

		})
		.catch(error => next (error))

})


app.post ('/api/persons', (req, res, next) => {

	const body = req.body

	const new_person = new Person ({
		name: body.name,
		number: body.number,
	})

	new_person.save().then(result => {
		console.log('person saved!')
		res.json(result)
	})
		.catch (error => next(error))
})


app.put ('/api/persons/:id', (req, res, next) => {

	const body = req.body

	if (!body.name || !body.number) {

		return res.status(400).json ({
			error: 'name or phone number missing'
		})

	}

	const updated_person = ({
		name: body.name,
		number: body.number,
	})

	Person
		.findByIdAndUpdate (req.params.id, updated_person, { runValidators: true, new: true, context: 'query' })
		.then (() => {
			res.json (updated_person)
		})
		.catch (err => next (err))

})

const errorHandler = (error, request, response, next) => {

	console.error(error.message)

	if (error.name === 'CastError') {
		return response.status(400).send({ error: 'malformed person id' })
	}

	else if (error.name === 'ValidationError') {
		return response.status(400).json({ error: error.message })
	}

	next(error)

}

app.use(errorHandler)


const PORT = process.env.PORT || 3001
app.listen(PORT)
console.log (`Server running on port ${PORT}`)

