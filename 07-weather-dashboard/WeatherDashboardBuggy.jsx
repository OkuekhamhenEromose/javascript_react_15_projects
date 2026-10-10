import { useState, useEffect } from 'react';
import { fetchWeather } from './mockWeatherApi';

// INTENTIONAL BUG: no protection against out-of-order responses.
export function WeatherDashboardBuggy({ city, delayMs }) {
  const [status, setStatus] = useState('idle');
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    if (!city) return;
    setStatus('loading');
    fetchWeather(city, delayMs)
      .then((data) => {
        setWeather(data); // BUG: no check whether THIS request is still the relevant one
        setStatus('success');
      })
      .catch(() => setStatus('error'));
  }, [city, delayMs]);

  if (status === 'idle') return <p>Search for a city.</p>;
  if (status === 'loading') return <p>Loading...</p>;
  if (status === 'error') return <p>Error loading weather.</p>;
  return <p data-testid="weather-result">{weather.city}: {weather.tempC}°C, {weather.condition}</p>;
}
