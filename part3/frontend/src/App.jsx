import { useState, useEffect } from 'react'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import People from './services/people'
import Notification from './components/Notification'  

const App = () => {
  const [newNumber, setNewNumber] = useState('');
  const [newName, setNewName] = useState('')  
  const [filter, setFilter] = useState(''); 
  const [persons, setPersons] = useState([]);
  const [notification, setNotification] = useState(null); 
  const handleNotification = (message, type = 'info') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000); 
  };

  useEffect(() => {
    console.log('Fetching data from the server...');
    People.getAll()
      .then(response => {
        console.log('Data received from the server:', response);
        setPersons(response);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        handleNotification('Error fetching data from the server', 'error');
      });
  }, []);  
  

  const deletePerson = (personToDelete) => {
    if (window.confirm(`Delete ${personToDelete.name}?`)) {
      People
        .remove(personToDelete.id)  
        .then(() => {
          setPersons(persons.filter(person => person.id !== personToDelete.id));
          handleNotification(`${personToDelete.name} has been deleted`, 'info');
        })
        .catch(error => {
          console.error('Error deleting the person:', error);
          handleNotification('There was an error deleting the person', 'error');
        });
    }
  };
  
  const handleNameChange = (event) => {
    setNewName(event.target.value);
  };

  const handlePhonenumberChange = (event) => {
    setNewNumber(event.target.value);
  };
  
  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
  
    const trimmedName = newName.trim();
    const trimmedNumber = newNumber.trim();
  
    // Validate the input for name length
    if (trimmedName.length < 3) {
      handleNotification(`Person validation failed: Path 'name' '(${trimmedName})' is shorter than the minimum allowed length`, 'error');
      return;
    }
  
    // Validate phone number format
    const phoneRegex = /^\d{2,3}-\d{6,}$/;
    if (!phoneRegex.test(trimmedNumber)) {
      handleNotification('Phone number must be in the format XX-XXXXXX or XXX-XXXXXX', 'error');
      return;
    }
  
    // Compare normalized names
    const personExists = persons.find(person => 
      person.name.trim().toLowerCase() === trimmedName.toLowerCase()
    );
  
    if (personExists) {
      const confirmUpdate = window.confirm(`${trimmedName} is already added to phonebook, replace the old number with a new one?`);
      if (confirmUpdate) {
        const updatedPerson = { ...personExists, number: trimmedNumber };
        People.update(personExists.id, updatedPerson)
          .then(updatedPersonData => {
            setPersons(persons.map(person => 
              person.id !== personExists.id ? person : updatedPersonData
            ));
            setNewName('');
            setNewNumber('');
            handleNotification(`${trimmedName}'s number has been updated`, 'info');
          })
          .catch(error => {
            console.error('Error updating the person:', error);
            handleNotification(`Information of ${trimmedName} has already been removed from server`, 'error');
            setPersons(persons.filter(person => person.id !== personExists.id));
          });
      }
    } else {
      const newPerson = { name: trimmedName, number: trimmedNumber };
      People.create(newPerson)
        .then(newPersonData => {
          setPersons(prevPersons => prevPersons.concat(newPersonData));
          setNewName('');
          setNewNumber('');
          handleNotification(`${newPersonData.name} has been added`, 'info');
        })
        .catch(error => {
          console.error('Error adding the person:', error);
          handleNotification(error.response?.data?.error || 'There was an error adding the person', 'error');
        });
    }
  };
  




  return (
    <div>
      <h2>Phonebook</h2>
      {notification && <Notification message={notification.message} type={notification.type} />}
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
  );
}

export default App;


  

