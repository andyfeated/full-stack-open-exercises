require('dotenv').config()
const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const app = express()
const Person = require('./models/person')

app.use(cors())
app.use(express.json())
app.use(express.static('build'))

morgan.token('body', (req) => {
  return JSON.stringify(req.body)
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

app.get('/api', (req, res) => {
  res.send('<h1>Phonebook Server</h1>')
})

app.get('/info', (req, res, next) => {
  Person.find({})
    .then(persons => {
      res.send(
        `<p>Phonebook has info for ${persons.length} people</p>
       <p>${new Date()}</p>
      `
      )
    })
    .catch(err => next(err))
})

app.get('/api/persons', (req, res) => {
  Person.find({}).then(persons => res.json(persons))
})

app.get('/api/persons/:id', (req, res, next) => {
  Person.findById(req.params.id)
    .then((person) => {
      res.json(person)
    })
    .catch(err => next(err))
})

app.delete('/api/persons/:id', (req, res, next) => {
  Person
    .findByIdAndRemove(req.params.id)
    .then(() => {
      res.status(204).end()
    })
    .catch(err => next(err))
})

app.post('/api/persons', (req, res, next) => {
  const body = req.body

  if(!body.name || !body.number){
    return res.status(400).json({ error: 'name/number missing' })
  }

  const newPerson = new Person({ ...req.body })

  newPerson.save()
    .then((savedPerson) => res.json(savedPerson))
    .catch(err => next(err))
})

app.put('/api/persons/:id', (req, res, next) => {
  const newPerson = { ...req.body }

  Person
    .findByIdAndUpdate(req.params.id, newPerson, { new: true, runValidators: true, context: 'query' })
    .then(updatedPerson => res.json(updatedPerson))
    .catch(err => next(err))
})

const unknownEndpoint = (req,res) => {
  res.status(404).send({ error: 'Unknown Endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, req, res, next) => {
  if(error.name === 'CastError'){
    return res.status(400).send({ error: 'malformed id' })
  }if(error.name === 'ValidationError'){
    return res.status(400).send({ error: error.message })
  }
  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})