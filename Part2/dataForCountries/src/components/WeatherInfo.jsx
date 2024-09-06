import React, { useState, useEffect } from 'react';
import { fetchWeather } from '../services/api';

const WeatherInfo = ({ capital }) => {
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getWeather = async () => {
      try {
        const data = await fetchWeather(capital);
        setWeather(data);
      } catch (error) {
        console.error('Error fetching weather:', error);
        setError(error.message);
      }
    };
    getWeather();
  }, [capital]);

    if (error) return <p>Error loading weather data: {error}</p>;
    if (!weather) return <p>Loading weather data...</p>;
  
    return (
      <div>
        <h2>Weather in {capital}</h2>
        <p>Temperature: {weather.main.temp}°C</p>
        <p>Weather: {weather.weather[0].description}</p>
        <img 
          src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`} 
          alt={weather.weather[0].description}
        />
        <p>Wind: {weather.wind.speed} m/s</p>
      </div>
    );
  };

  export default WeatherInfo;



