import { useEffect, useState } from 'react'
import personsServices from './services/persons'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import Notification from './components/Notification'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState("")
  const [message, setMessage] = useState({})

  useEffect(() => {
    personsServices
      .getAllPerson()
      .then(persons => {
        setPersons(persons)
      })
  }, [])

  const handleAddContact = (event) => {
    event.preventDefault()

    const duplicate = persons.find(person => person.name === newName)
    const newContact = {
      name: newName,
      number: newNumber,
    }

    if(!duplicate){
      console.log('works')
      personsServices
        .createPerson(newContact)
        .then(returnedContact => {
          setPersons(persons.concat(returnedContact))
          setMessage({ text: `Added ${returnedContact.name}`, status: 'success'})
          setTimeout(() => {
            setMessage(null)
          }, 5000)
          
          setNewName("")
          setNewNumber("")
        })
        .catch(err => {
          setMessage({ text: err.response.data.error })
          setTimeout(() => {
            setMessage(null)
          }, 5000)
        })
    }else{
      const confirm = window.confirm(`${newName} is already added to the phonebook, replace old number with a new one?`)
      
      if(confirm){
        personsServices
          .updatePerson(duplicate.id, newContact)
          .then(res => {
            setPersons(persons.map(person => person.id === duplicate.id ? res : person))
            setMessage({...message, text: `Updated ${res.name}'s number to ${res.number}`, status: 'success'})
            setTimeout(() => {
              setMessage(null)
            }, 5000)

            setNewName("")
            setNewNumber("")
          }).catch(err => {
            setMessage({ text: err.response.data.error })
            setTimeout(() => {
              setMessage(null)
            }, 5000)            
          })
      }
    }
  }

  const handleSearch = (event) =>{
    setFilter(event.target.value)
    const results = persons.filter(
      person => person.name.toLowerCase().includes(filter.toLowerCase())
    )

    setPersons(results)
  }

  const handleDeletePerson = (id, name) => {
    const confirm = window.confirm(`Delete ${name}?`)
    if(confirm){
      personsServices
      .deletePerson(id)
      .then(res => {
        setPersons(persons.filter(person => person.id !== id))
      })
    }
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
        <Notification text={message?.text} status={message?.status} />
        <Filter onChange={handleSearch} value={filter} />
      <h2>add a new</h2>
        <PersonForm 
          nameValue={newName}
          numberValue={newNumber}
          onSubmit={handleAddContact}
          onNameChange={handleNameChange} 
          onNumberChange={handleNumberChange} 
        />
      <h2>Numbers</h2>
      <Persons handleDeletePerson={handleDeletePerson} persons={persons} />
    </div>
  )
}

export default App