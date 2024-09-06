import React, { useState, useEffect } from 'react';
import axios from 'axios';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';

function App() {
  const [count, setCount] = useState(0)
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      console.log('Fetching data from server ...'); 
      const response = await fetch('http://localhost:3001/persons');
      const json = await response.json();
      setData(json);
    }
    fetchData();
  } , []);



  return (
    <>
        <p>
        Data fetched from server: {JSON.stringify(data)} {/* Displaying fetched data */}
        </p>
    </>
  )
}

export default App
