import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Dashboard from './Dashboard';

beforeEach(() => {
  localStorage.clear(); // ensure each test starts from a genuinely fresh state
});

test('shows empty state with no counters initially', () => {
  render(<Dashboard />);
  expect(screen.getByText('No counters yet - add one above.')).toBeInTheDocument();
  expect(screen.getByTestId('total-display')).toHaveTextContent('Total: 0');
});

test('adding a counter creates it starting at 0', async () => {
  const user = userEvent.setup();
  render(<Dashboard />);

  await user.type(screen.getByLabelText('New counter name'), 'Coffees');
  await user.click(screen.getByText('Add counter'));

  expect(screen.getByText('Coffees')).toBeInTheDocument();
  expect(screen.queryByText('No counters yet - add one above.')).not.toBeInTheDocument();
});

test('incrementing one counter updates ONLY that counter and the total', async () => {
  const user = userEvent.setup();
  render(<Dashboard />);

  await user.type(screen.getByLabelText('New counter name'), 'Coffees');
  await user.click(screen.getByText('Add counter'));
  await user.type(screen.getByLabelText('New counter name'), 'Water');
  await user.click(screen.getByText('Add counter'));

  await user.click(screen.getByLabelText('Increment Coffees'));
  await user.click(screen.getByLabelText('Increment Coffees'));
  await user.click(screen.getByLabelText('Increment Water'));

  expect(screen.getByText('Coffees').closest('div')).toHaveTextContent('Count: 2');
  expect(screen.getByText('Water').closest('div')).toHaveTextContent('Count: 1');
  expect(screen.getByTestId('total-display')).toHaveTextContent('Total: 3');
});

test('removing a counter removes only that counter, total adjusts', async () => {
  const user = userEvent.setup();
  render(<Dashboard />);

  await user.type(screen.getByLabelText('New counter name'), 'Coffees');
  await user.click(screen.getByText('Add counter'));
  await user.click(screen.getByLabelText('Increment Coffees'));
  await user.click(screen.getByLabelText('Increment Coffees'));

  await user.type(screen.getByLabelText('New counter name'), 'Water');
  await user.click(screen.getByText('Add counter'));

  expect(screen.getByTestId('total-display')).toHaveTextContent('Total: 2');

  await user.click(screen.getByLabelText('Remove Coffees'));

  expect(screen.queryByText('Coffees')).not.toBeInTheDocument();
  expect(screen.getByText('Water')).toBeInTheDocument();
  expect(screen.getByTestId('total-display')).toHaveTextContent('Total: 0');
});

test('does not add a counter with a blank name', async () => {
  const user = userEvent.setup();
  render(<Dashboard />);

  await user.click(screen.getByText('Add counter')); // submit with empty input
  expect(screen.getByText('No counters yet - add one above.')).toBeInTheDocument();
});

test('state persists across a simulated reload via localStorage', async () => {
  const user = userEvent.setup();
  const { unmount } = render(<Dashboard />);

  await user.type(screen.getByLabelText('New counter name'), 'Steps');
  await user.click(screen.getByText('Add counter'));
  await user.click(screen.getByLabelText('Increment Steps'));
  await user.click(screen.getByLabelText('Increment Steps'));
  await user.click(screen.getByLabelText('Increment Steps'));

  unmount(); // simulate leaving the page

  render(<Dashboard />); // simulate a fresh page load, reading from the SAME localStorage

  expect(screen.getByText('Steps')).toBeInTheDocument();
  expect(screen.getByText('Steps').closest('div')).toHaveTextContent('Count: 3');
  expect(screen.getByTestId('total-display')).toHaveTextContent('Total: 3');
});
