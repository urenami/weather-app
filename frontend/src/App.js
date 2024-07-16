import React, { useState, useEffect } from 'react';
import './App.css';
import axios from 'axios';

function App() {
    const [city, setCity] = useState('');
    const [currentWeather, setCurrentWeather] = useState({});
    const [fiveDayForecast, setFiveDayForecast] = useState([]);

    const handleSearch = async () => {
        try {
            const weatherResponse = await axios.get(`http://localhost:8000/api/weather/current/?city=${city}`);
            setCurrentWeather(weatherResponse.data);

            const forecastResponse = await axios.get(`http://localhost:8000/api/weather/forecast/?city=${city}`);
            setFiveDayForecast(forecastResponse.data);
        } catch (error) {
            console.error('Error fetching weather data:', error);
        }
    };

    useEffect(() => {
        
        handleSearch();
    }, []); 

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
            
            {/* Current Weather Section */}
            {Object.keys(currentWeather).length > 0 && (
                <div className="current-weather">
                    <h2>Current Weather in {city}</h2>
                    <div>
                        <p>Temperature: {currentWeather.temperature}°C</p>
                        <p>Humidity: {currentWeather.humidity}%</p>
                        <p>Description: {currentWeather.description}</p>
                    </div>
                </div>
            )}

            {/* 5-Day Forecast Section */}
            {fiveDayForecast.length > 0 && (
                <div className="five-day-forecast">
                    <h2>5-Day Weather Forecast for {city}</h2>
                    <div className="forecast-grid">
                        {fiveDayForecast.map((day, index) => (
                            <div key={index} className="forecast-day">
                                <h3>Date: {day.date}</h3>
                                {day.forecasts.map((forecast, idx) => (
                                    <div key={idx} className="forecast-item">
                                        <div className="forecast-time">Time: {forecast.time}</div>
                                        <p>Temperature: {forecast.temperature}°C</p>
                                        <p>Humidity: {forecast.humidity}%</p>
                                        <p className="forecast-description">Description: {forecast.description}</p>
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default App;
