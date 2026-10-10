import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import ProductCatalog, { getFilterComputeCount, resetFilterComputeCount } from './ProductCatalog';

beforeEach(() => {
  resetFilterComputeCount();
});

test('shows all products by default, sorted by name', () => {
  render(<ProductCatalog />);
  const items = screen.getAllByRole('listitem').map((li) => li.textContent);
  expect(items[0]).toMatch(/^Baseball Cap/);
  expect(items).toHaveLength(8);
});

test('category filter narrows results correctly', async () => {
  const user = userEvent.setup();
  render(<ProductCatalog />);

  await user.selectOptions(screen.getByLabelText('Category'), 'Footwear');

  const items = screen.getAllByRole('listitem').map((li) => li.textContent);
  expect(items).toHaveLength(2);
  expect(items.every((text) => text.includes('Footwear'))).toBe(true);
});

test('sorting by price ascending/descending works correctly', async () => {
  const user = userEvent.setup();
  render(<ProductCatalog />);

  await user.selectOptions(screen.getByLabelText('Sort by'), 'price-asc');
  let items = screen.getAllByRole('listitem').map((li) => li.textContent);
  expect(items[0]).toMatch(/Winter Scarf/); // $15.50, cheapest

  await user.selectOptions(screen.getByLabelText('Sort by'), 'price-desc');
  items = screen.getAllByRole('listitem').map((li) => li.textContent);
  expect(items[0]).toMatch(/Hiking Boots/); // $120.00, most expensive
});

test('search filters by name (after debounce settles)', async () => {
  vi.useFakeTimers({ shouldAdvanceTime: true });
  const user = userEvent.setup({ delay: null });
  render(<ProductCatalog />);

  await user.type(screen.getByLabelText('Search products'), 'keyboard');
  await vi.advanceTimersByTimeAsync(350);
  await act(async () => {});

  const items = screen.getAllByRole('listitem').map((li) => li.textContent);
  expect(items).toHaveLength(1);
  expect(items[0]).toMatch(/Mechanical Keyboard/);

  vi.useRealTimers();
});

test('shows an empty state when nothing matches', async () => {
  vi.useFakeTimers({ shouldAdvanceTime: true });
  const user = userEvent.setup({ delay: null });
  render(<ProductCatalog />);

  await user.type(screen.getByLabelText('Search products'), 'zzz-nonexistent');
  await vi.advanceTimersByTimeAsync(350);
  await act(async () => {});

  expect(screen.getByText('No products match your search.')).toBeInTheDocument();

  vi.useRealTimers();
});

test('PROOF: useMemo skips recomputation on unrelated re-renders', async () => {
  const user = userEvent.setup();
  render(<ProductCatalog />);

  const countAfterInitialRender = getFilterComputeCount();
  expect(countAfterInitialRender).toBe(1); // computed exactly once on mount

  // Trigger an UNRELATED re-render (a state change useMemo does NOT depend on)
  await user.click(screen.getByText('Unrelated re-render trigger'));
  await user.click(screen.getByText('Unrelated re-render trigger'));
  await user.click(screen.getByText('Unrelated re-render trigger'));

  console.log('Compute count after 3 unrelated re-renders:', getFilterComputeCount());
  expect(getFilterComputeCount()).toBe(1); // STILL 1 - useMemo correctly skipped recomputation

  // NOW change something the memo actually depends on
  await user.selectOptions(screen.getByLabelText('Category'), 'Footwear');
  console.log('Compute count after a REAL dependency change:', getFilterComputeCount());
  expect(getFilterComputeCount()).toBe(2); // NOW it recomputed, correctly
});
