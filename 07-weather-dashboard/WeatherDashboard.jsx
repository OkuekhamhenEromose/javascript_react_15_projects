import { useState, useEffect } from 'react';
import { fetchWeather } from './mockWeatherApi';

export function WeatherDashboard({ city, delayMs }) {
  const [status, setStatus] = useState('idle');
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    if (!city) return;

    let ignore = false; // THE FIX - a per-effect-run flag closed over by this specific effect call
    setStatus('loading');

    fetchWeather(city, delayMs)
      .then((data) => {
        if (ignore) return; // this response belongs to a SUPERSEDED request - discard it
        setWeather(data);
        setStatus('success');
      })
      .catch(() => {
        if (ignore) return;
        setStatus('error');
      });

    // Cleanup runs BEFORE the next effect call (i.e., when city/delayMs changes again)
    // or on unmount - marking THIS specific request's result as no longer relevant.
    return () => {
      ignore = true;
    };
  }, [city, delayMs]);

  if (status === 'idle') return <p>Search for a city.</p>;
  if (status === 'loading') return <p>Loading...</p>;
  if (status === 'error') return <p>Error loading weather.</p>;
  return <p data-testid="weather-result">{weather.city}: {weather.tempC}°C, {weather.condition}</p>;
}
