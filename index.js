const express = require('express')
const app = express()

app.use(express.json())

let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/', (request, response) => {
    response.send('<h1>hello world</h1>')
})

app.get('/info', (request, response) => {
    const personsCount = persons.length
    const date = new Date()
    response.send(`Phonebook has info for ${personsCount} people. <br/><br/> ${date.toString()}`)
    
})

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)
    
    if (person) {
        response.json(person)
    } else {
        response.status(404)
    }
    response.json(person)
})

app.post('/api/persons', (request, response) => {
    const newPerson = request.body
    newPerson.id = Math.floor(Math.random() * 100)
    console.log(newPerson)

    const nameExists = persons.some(person => person.name.toLowerCase() === newPerson.name.toLowerCase())

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
        persons = persons.concat(newPerson)
        response.json(newPerson)
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)

    response.status(204).end()
})

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})