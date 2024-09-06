import React from 'react';

const Persons = ({ persons, filter, deletePerson }) => {
  const filteredPersons = persons && persons.length > 0 
    ? persons.filter(person => 
        person.name && person.name.toLowerCase().includes((filter || '').toLowerCase())
      )
    : [];

  return (
    <div>
      {filteredPersons.map(person => (
        <div key={person.id}>
          {person.name} {person.number}
          <button onClick={() => deletePerson(person)}>Delete</button>
        </div>
      ))}
    </div>
  );
}

export default Persons;