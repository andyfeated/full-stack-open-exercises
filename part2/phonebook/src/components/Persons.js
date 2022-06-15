import Person from "./Person"

const Persons = ({persons, handleDeletePerson}) => {
  return (
    <div>
      {persons.map(person => <Person handleDeletePerson={handleDeletePerson} key={person.id} person={person} />)}
    </div>
  )
}

export default Persons