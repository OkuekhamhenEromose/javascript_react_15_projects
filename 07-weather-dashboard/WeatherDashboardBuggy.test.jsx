import { render, screen, act } from '@testing-library/react';
import { WeatherDashboardBuggy } from './WeatherDashboardBuggy';
import { vi } from 'vitest';

test('BUG: a SLOW first request resolves AFTER a fast second request, showing STALE data', async () => {
  vi.useFakeTimers({ shouldAdvanceTime: true });

  const { rerender } = render(<WeatherDashboardBuggy city="London" delayMs={1000} />);
  rerender(<WeatherDashboardBuggy city="Tokyo" delayMs={100} />);

  await act(async () => { await vi.advanceTimersByTimeAsync(150); });
  expect(screen.getByTestId('weather-result')).toHaveTextContent('Tokyo');

  await act(async () => { await vi.advanceTimersByTimeAsync(900); });
  expect(screen.getByTestId('weather-result')).toHaveTextContent('London'); // WRONG - user is looking at Tokyo!

  vi.useRealTimers();
});
