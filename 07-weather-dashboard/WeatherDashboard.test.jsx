import { render, screen, act } from '@testing-library/react';
import { WeatherDashboard } from './WeatherDashboard';
import { vi } from 'vitest';

test('FIX: a SLOW first request resolving LATE does NOT overwrite the current, fresher result', async () => {
  vi.useFakeTimers({ shouldAdvanceTime: true });

  const { rerender } = render(<WeatherDashboard city="London" delayMs={1000} />);
  rerender(<WeatherDashboard city="Tokyo" delayMs={100} />);

  await act(async () => { await vi.advanceTimersByTimeAsync(150); });
  expect(screen.getByTestId('weather-result')).toHaveTextContent('Tokyo');

  // London's slow, now-STALE response finally resolves - it must be IGNORED
  await act(async () => { await vi.advanceTimersByTimeAsync(900); });
  expect(screen.getByTestId('weather-result')).toHaveTextContent('Tokyo'); // still correct!

  vi.useRealTimers();
});

test('a normal, single search still works correctly (the fix does not break the happy path)', async () => {
  vi.useFakeTimers({ shouldAdvanceTime: true });
  render(<WeatherDashboard city="Nairobi" delayMs={300} />);

  expect(screen.getByText('Loading...')).toBeInTheDocument();

  await act(async () => { await vi.advanceTimersByTimeAsync(350); });
  expect(screen.getByTestId('weather-result')).toHaveTextContent('Nairobi: 24°C, Partly Cloudy');

  vi.useRealTimers();
});

test('shows an error state for an unknown city', async () => {
  vi.useFakeTimers({ shouldAdvanceTime: true });
  render(<WeatherDashboard city="Atlantis" delayMs={100} />);

  await act(async () => { await vi.advanceTimersByTimeAsync(150); });
  expect(screen.getByText('Error loading weather.')).toBeInTheDocument();

  vi.useRealTimers();
});
