import React, { useState } from 'react';
import './App.css';
import axios from 'axios';

function App() {
    const [city, setCity] = useState('');
    const [weather, setWeather] = useState(null);

    const handleSearch = async () => {
      try {
          console.log(`Fetching weather data for ${city}...`);
          const response = await axios.get(`http://localhost:8000/api/weather/current/?city=${city}`);
          console.log('Response received:', response.data);
          setWeather(response.data);
      } catch (error) {
          console.error('Error fetching weather data:', error);
      }
  };  

    return (
        <div className="App">
            <h1>Weather App</h1>
            <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Enter city"
            />
            <button onClick={handleSearch}>Search</button>
            {weather && (
                <div>
                    <h2>Current Weather in {weather.city}</h2>
                    <p>Temperature: {weather.temperature}°C</p>
                    <p>Humidity: {weather.humidity}%</p>
                    <p>Description: {weather.description}</p>
                </div>
            )}
        </div>
    );
}

export default App;
