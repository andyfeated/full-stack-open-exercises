import { useState } from 'react'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456', id: 1 },
    { name: 'Ada Lovelace', number: '39-44-5323523', id: 2 },
    { name: 'Dan Abramov', number: '12-43-234345', id: 3 },
    { name: 'Mary Poppendieck', number: '39-23-6423122', id: 4 }
  ]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState("")

  const handleAddContact = (event) => {
    event.preventDefault()

    const duplicate = persons.find(person => person.name === newName)

    if(!duplicate){
      setPersons(persons.concat({
        name: newName,
        number: newNumber
      }))
    }else{
      window.alert(`${newName} is already added to the phonebook`)
    }
    
  }

  const handleSearch = (event) =>{
    setFilter(event.target.value)
    const results = persons.filter(
      person => person.name.toLowerCase().includes(filter.toLowerCase())
    )

    setPersons(results)
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  return (
    <div>
      <h2>Phonebook</h2>
        <Filter onChange={handleSearch} value={filter} />
      <h2>add a new</h2>
        <PersonForm 
          onSubmit={handleAddContact} 
          onNameChange={handleNameChange} 
          onNumberChange={handleNumberChange} 
        />
      <h2>Numbers</h2>
      <Persons persons={persons} />
    </div>
  )
}

export default App