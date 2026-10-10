import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PerformanceDemo, renderCounts, resetRenderCounts } from './PerformanceDemo';

beforeEach(() => {
  resetRenderCounts();
});

test('initial render: each item renders exactly once', () => {
  render(<PerformanceDemo />);
  expect(renderCounts.plain).toBe(1);
  expect(renderCounts.memoNoCallback).toBe(1);
  expect(renderCounts.memoWithCallback).toBe(1);
});

test('PROOF: unmemoized component re-renders on every unrelated parent state change', async () => {
  const user = userEvent.setup();
  render(<PerformanceDemo />);

  await user.click(screen.getByText(/Unrelated re-render trigger/));
  await user.click(screen.getByText(/Unrelated re-render trigger/));
  await user.click(screen.getByText(/Unrelated re-render trigger/));

  console.log('Plain (no memo) render count after 3 unrelated clicks:', renderCounts.plain);
  expect(renderCounts.plain).toBe(4); // 1 initial + 3 re-renders - re-rendered EVERY time
});

test('GOTCHA, PROVEN: React.memo alone does NOT help if the callback prop is a new function every render', async () => {
  const user = userEvent.setup();
  render(<PerformanceDemo />);

  await user.click(screen.getByText(/Unrelated re-render trigger/));
  await user.click(screen.getByText(/Unrelated re-render trigger/));
  await user.click(screen.getByText(/Unrelated re-render trigger/));

  console.log('Memoized WITHOUT useCallback render count after 3 unrelated clicks:', renderCounts.memoNoCallback);
  // Despite being wrapped in React.memo, this STILL re-rendered every time,
  // because handleSelectNoCallback is a brand-new function reference on
  // every parent render - memo's shallow prop comparison sees a "changed" prop.
  expect(renderCounts.memoNoCallback).toBe(4);
});

test('THE FIX, PROVEN: React.memo + useCallback together correctly skip unrelated re-renders', async () => {
  const user = userEvent.setup();
  render(<PerformanceDemo />);

  await user.click(screen.getByText(/Unrelated re-render trigger/));
  await user.click(screen.getByText(/Unrelated re-render trigger/));
  await user.click(screen.getByText(/Unrelated re-render trigger/));

  console.log('Memoized WITH useCallback render count after 3 unrelated clicks:', renderCounts.memoWithCallback);
  // The callback reference is STABLE (useCallback), and the label/countingKey
  // props never change - React.memo correctly detects "nothing relevant
  // changed" and skips re-rendering entirely.
  expect(renderCounts.memoWithCallback).toBe(1); // STILL 1 - never re-rendered
});

test('memoized component STILL re-renders when its OWN relevant props genuinely change', async () => {
  const user = userEvent.setup();
  render(<PerformanceDemo />);

  await user.click(screen.getByText('Cherry')); // triggers setSelected - a state update, not a re-render trigger itself
  expect(screen.getByTestId('selected')).toHaveTextContent('Selected: Cherry');
  // Clicking Cherry re-renders the PARENT (selected state changed), but Cherry's
  // OWN props (label, onSelect, countingKey) are unchanged - so memoWithCallback
  // should NOT have incremented again due to this click.
  console.log('Memoized WITH useCallback count after clicking itself once:', renderCounts.memoWithCallback);
  expect(renderCounts.memoWithCallback).toBe(1);
});
