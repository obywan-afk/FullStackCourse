import { useState } from 'react'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'

const App = () => {
  const [newNumber, setNewNumber] = useState('');
  const [newName, setNewName] = useState('')   // 2 
  const [filter, setFilter] = useState(''); // State to hold the filter text

  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456', id: 1 },
    { name: 'Ada Lovelace', number: '39-44-5323523', id: 2 },
    { name: 'Dan Abramov', number: '12-43-234345', id: 3 },
    { name: 'Mary Poppendieck', number: '39-23-6423122', id: 4 }
  ])
 
  const handleNameChange = (event) => {
    setNewName(event.target.value);     // 1 
  };
  const handlePhonenumberChange = (event) => {
    setNewNumber(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault(); // Prevent the form from being submitted to the server
    const personExists = persons.some(person => person.name === newName);
    const numberExists = persons.some(person => person.number === newNumber);

    if (personExists) {
      alert(`${newName} is already added to the phonebook.`);
    } else if (numberExists) {
      alert(`${newNumber} is already used in the phonebook.`);
    } else {
      const newPerson = { name: newName, number: newNumber };
      setPersons(persons.concat(newPerson));
      setNewName(''); // Clear the input after adding
      setNewNumber(''); // Clear the input after adding
    }
  };

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter filter={filter} handleFilterChange={handleFilterChange} />
      <h3>add a new</h3>
      <PersonForm
        addPerson={handleSubmit}
        newName={newName}
        handleNameChange={handleNameChange}
        newNumber={newNumber}
        handleNumberChange={handlePhonenumberChange}
      />
      <h3>Numbers</h3>
      <Persons persons={persons} filter={filter} />
    </div>
  )
}

export default App





  

