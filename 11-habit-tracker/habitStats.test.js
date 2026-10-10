import { vi } from 'vitest';
import { calculateCurrentStreak, calculateLongestStreak, getTodayString } from './habitStats';

beforeEach(() => {
  vi.setSystemTime(new Date('2026-06-15T12:00:00Z')); // fixed, deterministic "today" for every test
});
afterEach(() => {
  vi.useRealTimers();
});

test('getTodayString reflects the mocked system time, not the real date', () => {
  expect(getTodayString()).toBe('2026-06-15');
});

test('current streak counts consecutive days ending today', () => {
  const completed = ['2026-06-13', '2026-06-14', '2026-06-15'];
  expect(calculateCurrentStreak(completed)).toBe(3);
});

test('current streak is 0 if today AND yesterday are both missing', () => {
  const completed = ['2026-06-10', '2026-06-11', '2026-06-12'];
  expect(calculateCurrentStreak(completed)).toBe(0);
});

test('a gap breaks the streak - only counts the CONSECUTIVE run ending today', () => {
  const completed = ['2026-06-01', '2026-06-02', '2026-06-14', '2026-06-15']; // gap between 06-02 and 06-14
  expect(calculateCurrentStreak(completed)).toBe(2); // only the 14th and 15th count
});

test('longest streak finds the best historical run, even if it is not the current one', () => {
  // A 5-day streak early on, then a gap, then today's shorter 2-day streak
  const completed = [
    '2026-05-01', '2026-05-02', '2026-05-03', '2026-05-04', '2026-05-05',
    '2026-06-14', '2026-06-15',
  ];
  expect(calculateLongestStreak(completed)).toBe(5);
});

test('longest streak handles duplicate dates without over- or under-counting', () => {
  const completed = ['2026-06-13', '2026-06-13', '2026-06-14', '2026-06-15'];
  expect(calculateLongestStreak(completed)).toBe(3); // duplicate doesn't count as a 4th day
});

test('empty completed dates gives a streak of 0', () => {
  expect(calculateCurrentStreak([])).toBe(0);
  expect(calculateLongestStreak([])).toBe(0);
});
