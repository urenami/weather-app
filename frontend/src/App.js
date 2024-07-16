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

    const convertToFahrenheit = (celsius) => (celsius * 9/5) + 32;

    const getDayOfWeek = (dateStr) => {
        const date = new Date(dateStr);
        const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        return daysOfWeek[date.getUTCDay()];
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
            
            {/* Current Weather Section */}
            {Object.keys(currentWeather).length > 0 && (
                <div className="current-weather">
                    <h2>Current Weather in {city}</h2>
                    <div>
                        <p>Temperature: {convertToFahrenheit(currentWeather.temperature).toFixed(2)}°F</p>
                        <p>Humidity: {currentWeather.humidity}%</p>
                        <p>Description: {currentWeather.description}</p>
                    </div>
                </div>
            )}

            {/* Weather Forecast Section */}
            {fiveDayForecast.length > 0 && (
                <div className="five-day-forecast">
                    <h2>Weather Forecast for {city}</h2>
                    <div className="forecast-grid">
                        {fiveDayForecast.map((day, index) => (
                            <div key={index} className="forecast-day">
                                <h3>Date: {new Date(day.date).toLocaleDateString('en-US', {
                                        weekday: 'long',
                                        year: 'numeric',
                                        month: '2-digit',
                                        day: '2-digit'
                                    })}</h3>
                                {day.forecasts.map((forecast, i) => (
                                    <div key={i} className="forecast-item">
                                        <p className="forecast-time">{forecast.time}</p>
                                        <p>Temperature: {convertToFahrenheit(forecast.temperature).toFixed(2)}°F</p>
                                        <p>Humidity: {forecast.humidity}%</p>
                                        <p className="forecast-description">{forecast.description}</p>
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
