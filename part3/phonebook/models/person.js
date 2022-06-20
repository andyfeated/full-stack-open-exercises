require('dotenv').config()
const mongoose = require('mongoose')
const url = process.env.MONGODB_URL

mongoose.connect(url)
  .then(() => console.log('connected to MongoDB'))
  .catch((err) => console.log('failed connecting to MongoDB', err.message))

const personSchema = new mongoose.Schema({
  name: { type: String, minLength: 3 },
  number: {
    type: String,
    validate: [
      {
        validator: (v) => {
          if(v.length >= 8){
            return true
          }
          return false
        },
        message: 'number must have a length of 8 or more'
      },
      {
        validator: (v) => /^\d{2,3}-\d+$/.test(v),
        message: 'invalid phone number'
      }
    ],
    minLength: 8
  },
})

personSchema.set('toJSON', {
  transform: (doc, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', personSchema)