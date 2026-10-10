// MOCK API - clearly labeled per course policy. Simulates a real weather service's
// async behavior (variable network delay, city-not-found errors) without a live network call.

const MOCK_WEATHER_DB = {
  lagos: { city: 'Lagos', tempC: 31, condition: 'Sunny' },
  london: { city: 'London', tempC: 14, condition: 'Cloudy' },
  tokyo: { city: 'Tokyo', tempC: 22, condition: 'Rainy' },
  nairobi: { city: 'Nairobi', tempC: 24, condition: 'Partly Cloudy' },
};

// delayMs is configurable specifically so we can DEMONSTRATE a race condition on purpose.
export function fetchWeather(city, delayMs = 500) {
  const key = city.trim().toLowerCase();
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (MOCK_WEATHER_DB[key]) {
        resolve(MOCK_WEATHER_DB[key]);
      } else {
        reject(new Error(`No weather data found for "${city}"`));
      }
    }, delayMs);
  });
}
