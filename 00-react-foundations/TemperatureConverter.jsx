import { useState } from 'react';

function TemperatureInput({ celsius, onCelsiusChange }) {
  return (
    <div>
      <label htmlFor="celsius">Celsius</label>
      <input id="celsius" value={celsius} onChange={(e) => onCelsiusChange(e.target.value)} />
    </div>
  );
}

function TemperatureDisplay({ celsius }) {
  const fahrenheit = celsius === '' ? '' : (Number(celsius) * 9) / 5 + 32;
  return <p data-testid="fahrenheit">Fahrenheit: {fahrenheit}</p>;
}

export function TemperatureConverter() {
  const [celsius, setCelsius] = useState(''); // lifted to the common parent

  return (
    <div>
      <TemperatureInput celsius={celsius} onCelsiusChange={setCelsius} />
      <TemperatureDisplay celsius={celsius} />
    </div>
  );
}
// 0 errors
