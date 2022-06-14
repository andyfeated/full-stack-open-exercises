import axios from 'axios'
import { useEffect, useState } from 'react'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState("")

  useEffect(() => {
    axios
      .get("http://localhost:3001/persons")
      .then(res => {
        setPersons(res.data)
      })
  }, [])

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