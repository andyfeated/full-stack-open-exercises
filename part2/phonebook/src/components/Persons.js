import Person from "./Person"

const Persons = ({persons}) => {
  return (
    <div>
      {persons.map(person => <Person person={person} />)}
    </div>
  )
}

export default Persons