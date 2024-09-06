import React from 'react';
import WeatherInfo from './WeatherInfo';

const CountryDetail = ({ country }) => (
    <div>
      <h2>{country.name.common}</h2>
      <p>Capital: {country.capital[0]}</p>
      <p>Population: {country.population.toLocaleString()}</p>
      <h3>Languages:</h3>
      <ul>
        {Object.values(country.languages).map(language => (
          <li key={language}>{language}</li>
        ))}
      </ul>
      <img src={country.flags.png} alt={`Flag of ${country.name.common}`} style={{ width: '150px' }} />
      <WeatherInfo capital={country.capital[0]} />
    </div>
  );
  

export default CountryDetail;