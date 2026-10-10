import { renderHook, act } from '@testing-library/react';
import { useDebouncedValue } from './useDebouncedValue';
import { vi } from 'vitest';

beforeEach(() => {
  vi.useFakeTimers();
});
afterEach(() => {
  vi.useRealTimers();
});

test('does NOT update immediately when the input value changes', () => {
  const { result, rerender } = renderHook(({ value }) => useDebouncedValue(value, 300), {
    initialProps: { value: 'r' },
  });

  expect(result.current).toBe('r');

  rerender({ value: 're' });
  expect(result.current).toBe('r'); // still the OLD value - hasn't debounced yet
});

test('updates to the LATEST value only after the delay has fully elapsed, collapsing a rapid burst', () => {
  const { result, rerender } = renderHook(({ value }) => useDebouncedValue(value, 300), {
    initialProps: { value: 'r' },
  });

  rerender({ value: 're' });
  act(() => vi.advanceTimersByTime(100)); // not enough time yet
  rerender({ value: 'rea' });
  act(() => vi.advanceTimersByTime(100));
  rerender({ value: 'reac' });
  act(() => vi.advanceTimersByTime(100));
  rerender({ value: 'react' });

  expect(result.current).toBe('r'); // STILL hasn't updated - each rerender reset the timer

  act(() => vi.advanceTimersByTime(300)); // now let the FINAL timer fully elapse
  expect(result.current).toBe('react'); // collapsed straight to the final value, exactly like Snippet 29
});
