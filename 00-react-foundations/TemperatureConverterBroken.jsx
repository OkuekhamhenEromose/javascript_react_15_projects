 import { useState } from 'react';

function TemperatureInputBroken() {
  const [celsius, setCelsius] = useState('');
  return (
    <div>
      <label htmlFor="celsius-broken">Celsius</label>
      <input id="celsius-broken" value={celsius} onChange={(e) => setCelsius(e.target.value)} />
    </div>
  );
}

function TemperatureDisplayBroken() {
  // BUG: this component has NO WAY to know what was typed in the sibling input above -
  // it can only hold its OWN separate, disconnected piece of state
  const [celsius] = useState('');
  const fahrenheit = celsius === '' ? '' : (Number(celsius) * 9) / 5 + 32;
  return <p data-testid="fahrenheit-broken">Fahrenheit: {fahrenheit}</p>;
}

export function TemperatureConverterBroken() {
  return (
    <div>
      <TemperatureInputBroken />
      <TemperatureDisplayBroken />
    </div>
  );
}
