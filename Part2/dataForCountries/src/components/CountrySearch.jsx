import React, { useState, useEffect } from 'react';
import { fetchCountries } from '../services/api';
import CountryDetail from './CountryDetail';

const CountrySearch = () => {
  const [countries, setCountries] = useState([]);
  const [search, setSearch] = useState('');
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);

  useEffect(() => {
    const getCountries = async () => {
      try {
        const data = await fetchCountries();
        setCountries(data);
      } catch (error) {
        console.error('Error fetching countries:', error);
      }
    };
    getCountries();
  }, []);

  useEffect(() => {
    const filtered = countries.filter(country =>
      country.name.common.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredCountries(filtered);
    setSelectedCountry(null);
  }, [search, countries]);

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
  };

  const handleCountrySelect = (country) => {
    setSelectedCountry(country);
  };

  const renderCountries = () => {
    if (search === '') {
      return null; 
    } else if (filteredCountries.length > 10) {
      return <p>Too many matches, specify another filter</p>;
    } else if (filteredCountries.length > 1) {
      return (
        <ul>
          {filteredCountries.map(country => (
            <li key={country.cca3}>
              {country.name.common}
              <button onClick={() => handleCountrySelect(country)}>Show</button>
            </li>
          ))}
        </ul>
      );
    } else if (filteredCountries.length === 1) {
      return <CountryDetail country={filteredCountries[0]} />;
    } else {
      return <p>No matches found</p>;
    }
  };

  return (
    <div>
      <h1>Country Search</h1>
      <label>find countries</label>
      <input
        type="text"
        value={search}
        onChange={handleSearchChange}
      />
      {selectedCountry ? (
        <CountryDetail country={selectedCountry} />
      ) : (
        renderCountries()
      )}
    </div>
  );
};

export default CountrySearch;