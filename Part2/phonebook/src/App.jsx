import { useState, useEffect } from 'react'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import People from './services/people'


const App = () => {
  const [newNumber, setNewNumber] = useState('');
  const [newName, setNewName] = useState('')  
  const [filter, setFilter] = useState(''); 
  const [persons, setPersons] = useState([])



  useEffect(() => {
    People.read()
      .then(response => {
        setPersons(response.data)
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, [])


  const deletePerson = (personToDelete) => {
    if (window.confirm(`Delete ${personToDelete.name}?`)) {
        People
          .deletePerson(personToDelete.id)
          .then(() => {
            setPersons(persons.filter(person => person.id !== personToDelete.id));
        })
        .catch(error => {
            console.error('Error deleting the person:', error);
            alert('There was an error deleting the person.');
        });
    }
};



  const handleNameChange = (event) => {
    setNewName(event.target.value);     // 1 
  };
  const handlePhonenumberChange = (event) => {
    setNewNumber(event.target.value);
  };

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };




  const handleSubmit = (event) => {
    event.preventDefault();
    const personExists = persons.find(person => person.name.toLowerCase() === newName.toLowerCase());
    
    if (personExists) {
      const confirmUpdate = window.confirm(
        `${newName} is already added to phonebook, replace the old number with a new one?`
      );
      if (confirmUpdate) {
        const updatedPerson = { ...personExists, number: newNumber };
        People.update(personExists.id, updatedPerson)
          .then(response => {
            setPersons(persons.map(person => 
              person.id !== personExists.id ? person : response.data
            ));
            setNewName('');
            setNewNumber('');
          })
          .catch(error => {
            console.error('Error updating the person:', error);
            alert(`Information of ${newName} has already been removed from server`);
            setPersons(persons.filter(person => person.id !== personExists.id));
          });
      }
    } else {
      const newPerson = { name: newName, number: newNumber };
      People.create(newPerson)
        .then(response => {
          setPersons(prevPersons => prevPersons.concat(response.data));
          setNewName('');
          setNewNumber('');
        })
        .catch(error => {
          console.error('Error adding the person:', error);
          alert('There was an error adding the person.');
        });
    }
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
      <Persons persons={persons} filter={filter} deletePerson={deletePerson} />

    </div>
  )
}

export default App





  

