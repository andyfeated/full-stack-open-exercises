const mongoose = require('mongoose')

if(process.argv.length < 3){
  console.log('Please provide the password as an argument: node mongo.js <password>')
  process.exit(1)
}

const password = process.argv[2]
const url = `mongodb+srv://andybanua30:${password}@cluster0.i5n6j.mongodb.net/phonebookApp?retryWrites=true&w=majority`

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

mongoose.connect(url).then(() => {
  if(process.argv.length === 3){
    Person.find({}).then(res => {
      console.log('phonebook:')

      res.forEach(person => {
        console.log(`${person.name} ${person.number}`)
      })
      mongoose.connection.close()
    })
  }

  if(process.argv.length === 5){
    const name = process.argv[3]
    const number = process.argv[4]

    const newPerson = { name, number }

    new Person(newPerson)
      .save()
      .then(() => {
        console.log(`added ${name} number ${number} to phonebook`)
        mongoose.connection.close()
      })
  }
})

