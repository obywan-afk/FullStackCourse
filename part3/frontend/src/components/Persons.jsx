const Persons = ({ persons, filter, deletePerson }) => {  
  const filteredPersons = persons && persons.length > 0 
    ? persons.filter(person => 
        person.name && person.name.toLowerCase().includes((filter || '').toLowerCase())
      )
    : [];
  return (
    <div>
      {filteredPersons.length > 0 ? (
        filteredPersons.map(person => (
          <div key={person.id}>
            {person.name} {person.number}
            <button onClick={() => deletePerson(person)}>Delete</button>
          </div>
        ))
      ) : (
        <p>No persons match the filter</p>
      )}
    </div>
  );
};


export default Persons;


