require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
const Person = require('./models/person')

app.use(express.json())
app.use(cors())
app.use(express.static('build'))

morgan.token('json-content', (request) => {
    if (request.method === 'POST') {
        return JSON.stringify(request.body)
    }
} )

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :json-content'))

const errorHandler = (error, request, response, next) => {
    console.error(error.message)
    next(error)
}

app.use(errorHandler)

app.get('/', (request, response) => {
    response.send('<h1>hello world</h1>')
})

/* app.get('/info', (request, response) => {
    const personsCount = persons.length
    const date = new Date()
    response.send(`Phonebook has info for ${personsCount} people. <br/><br/> ${date.toString()}`)
    
}) */

app.get('/api/persons', (request, response, next) => {
    Person.find({}).then(persons => {
        response.json(persons)
    })
    .catch(error => next(error))
})

app.get('/api/persons/:id', (request, response, next) => {
    const uid = request.params.id
    console.log(uid)
    const person = Person.find({ _id: uid }).then(person => {
        if (person) {
            response.json(person)
            console.log(person)
        } else {
            response.status(404)
            response.json({ error: 'Person not found'})
        }
    })
    .catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
    const newPerson = request.body
    console.log(newPerson)

    // const nameExists = persons.some(person => person.name.toLowerCase() === newPerson.name.toLowerCase())
    const nameExists = false

    if (!newPerson.name || !newPerson.number) {
        response.status(503)
        response.json(
            {error: 'name and number must exist'}
        )
    } else if (nameExists) {
        response.status(503)
        response.json(
            {error: 'name already exists in phonebook'}
        )
    } else {
        const person = new Person({
            name: newPerson.name,
            number: newPerson.number
        })

        person.save()
            .then(savedPerson => {
                response.json(savedPerson)
            })
            .catch(error => {
                next(error)
                response.status(500).end()
            })
    }
    
})

app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndRemove(request.params.id)
        .then(result => {
            response.status(204).end()
        })
        .catch(error => next(error))
})

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})