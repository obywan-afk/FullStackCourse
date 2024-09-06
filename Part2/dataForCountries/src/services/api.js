import axios from 'axios';

const COUNTRIES_API_URL = 'https://studies.cs.helsinki.fi/restcountries/api/all';
const WEATHER_API_URL = 'https://api.openweathermap.org/data/2.5/weather';
const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

export const fetchCountries = async () => {
  try {
    const response = await axios.get(COUNTRIES_API_URL);
    return response.data;
  } catch (error) {
    console.error('Error fetching countries:', error);
    throw error;
  }
};

export const fetchWeather = async (capital) => {
  try {
    const response = await axios.get(`${WEATHER_API_URL}?q=${capital}&appid=${API_KEY}&units=metric`);
    return response.data;
  } catch (error) {
    console.error('Error fetching weather:', error);
    throw error;
  }
};