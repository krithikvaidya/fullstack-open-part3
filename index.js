
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const app = express ()

morgan.token('body', req => {
    return req.method === "POST" ? JSON.stringify(req.body) : null
})

app.use (cors())
app.use (morgan(':method :url :status :res[content-length] - :response-time ms :body'))
app.use (express.json())

let persons = [

    {
        "name": "Arto Hellas",
        "number": "44523412",
        "id": 1
    },

    {
        "name": "Ada Lovelace",
        "number": "342377681",
        "id": 2
    },

    {
        "name": "Dan Abramov",
        "number": "12-43-234345",
        "id": 3
    },

    {
        "name": "Mary Poppendieck",
        "number": "39-23-6423122",
        "id": 4
    }

]

app.get ('/api/persons', (req, res) => {

    res.json (persons)

})

app.get ('/api/persons/:id', (req, res) => {

    const id = Number(req.params.id)
    const person = persons.find (person => person.id === id)

    if (person) {
        res.json (person)
    }
    else {
        res.status(404).end()
    }

})

app.delete ('/api/persons/:id', (req, res) => {

    const id = Number(req.params.id)

    persons = persons.filter (person => person.id !== id)
    
    res.status(204).end()

})

app.get ('/info', (req, res) => {

    const record_count = persons.length
    const date_time = new Date

    res.send (`
        <p>Phonebook has info for ${record_count} people</p>
        <p>${date_time}</p>
    `)

})


app.post ('/api/persons', (req, res) => {

    const body = req.body

    if (!body.name || !body.number) {

        return res.status(400).json ({
            error: "name or phone number missing"
        })

    }

    if (persons.find (person => person.name === body.name)) {

        return res.status(400).json ({
            error: `${body.name}'s record already exists`
        })

    }
    

    const id = Math.floor(Math.random() * 100000)

    const new_person = {
        name: body.name,
        number: body.number,
        id: id
    }

    persons = persons.concat(new_person)

    res.json(new_person)

})


const PORT = process.env.PORT || 3001
app.listen(PORT)
console.log (`Server running on port ${PORT}`)

