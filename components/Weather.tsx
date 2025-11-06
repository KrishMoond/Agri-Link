import React, { useState, KeyboardEvent } from 'react';
import axios from 'axios';
import { Oval } from 'react-loader-spinner';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faFrown } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import '../src/css/weather.css';

interface WeatherData {
  name: string;
  sys: { country: string };
  main: { temp: number };
  weather: { description: string; icon: string }[];
  wind: { speed: number };
}

interface WeatherState {
  loading: boolean;
  data: Partial<WeatherData>; // Partial because data will be populated dynamically
  error: boolean;
}

const Weather: React.FC = () => {
  const [input, setInput] = useState<string>(''); // Typing input as string
  const [weather, setWeather] = useState<WeatherState>({
    loading: false,
    data: {},
    error: false,
  });

  // Function to format the current date
  const toDateFunction = (): string => {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December',
    ];
    const WeekDays = [
      'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday',
    ];
    const currentDate = new Date();
    const date = `${WeekDays[currentDate.getDay()]} ${currentDate.getDate()} ${months[currentDate.getMonth()]}`;
    return date;
  };

  // Function to handle the search when pressing Enter
  const search = async (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      setInput('');
      setWeather({ ...weather, loading: true });

      const url = 'https://api.openweathermap.org/data/2.5/weather';
      const api_key = 'f00c38e0279b7bc85480c3fe775d518c';

      try {
        const res = await axios.get(url, {
          params: {
            q: input,
            units: 'metric',
            appid: api_key,
          },
        });
        setWeather({ data: res.data, loading: false, error: false });
      } catch (error) {
        setWeather({ ...weather, data: {}, error: true });
        setInput('');
      }
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto bg-white/80 backdrop-blur-md rounded-2xl shadow-2xl mt-8 animate-fadeIn">
      <Link to="/" className="flex items-center text-green-600 hover:underline mb-6">
        <FontAwesomeIcon icon={faArrowLeft} size="lg" />
        <span className="ml-2 font-semibold">Back to Home</span>
      </Link>
      <h1 className="text-3xl font-extrabold mb-6 text-center text-green-700 tracking-tight">Live Weather</h1>
      <div className="mb-6 flex items-center justify-center relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" /></svg>
        </span>
        <input
          type="text"
          className="w-full pl-12 pr-4 py-3 rounded-full border border-gray-200 shadow focus:ring-2 focus:ring-green-400 focus:outline-none transition-all duration-200 bg-white text-gray-800 placeholder-gray-400"
          placeholder="Enter City Name..."
          value={input}
          onChange={(event) => setInput(event.target.value)}
          onKeyPress={search}
        />
      </div>
      {weather.loading && (
        <div className="flex flex-col items-center justify-center h-32 animate-pulse">
          <Oval color="#22c55e" height={60} width={60} />
          <span className="mt-2 text-green-600 font-semibold">Loading...</span>
        </div>
      )}
      {weather.error && (
        <div className="flex flex-col items-center text-red-600 mb-4 animate-fadeIn">
          <FontAwesomeIcon icon={faFrown} size="2x" />
          <span className="mt-2 text-lg font-semibold">City not found</span>
        </div>
      )}
      {weather.data && weather.data.main && (
        <div className="flex flex-col items-center text-center bg-gradient-to-br from-green-50 to-white rounded-xl p-6 shadow-inner animate-fadeIn">
          <h2 className="text-2xl font-bold text-gray-800 mb-1">
            {weather.data.name}, <span className="text-green-600">{weather.data.sys?.country}</span>
          </h2>
          <span className="text-gray-500 mb-2">{toDateFunction()}</span>
          <img
            src={`https://openweathermap.org/img/wn/${weather.data.weather?.[0].icon}@2x.png`}
            alt={weather.data.weather?.[0].description}
            className="mb-2 w-24 h-24 drop-shadow-lg"
          />
          <span className="text-5xl font-extrabold text-green-700 mb-1">
            {Math.round(weather.data.main.temp)}<sup className="text-2xl">°C</sup>
          </span>
          <div className="text-gray-700 mt-2 text-lg font-medium">
            <p>{weather.data.weather?.[0].description.toUpperCase()}</p>
            <p className="text-sm text-gray-500 mt-1">Wind Speed: {weather.data.wind?.speed} m/s</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Weather;
