import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Counter from './Counter';

test('starts at the given starting value', () => {
  render(<Counter startingValue={5} />);
  expect(screen.getByTestId('count-display')).toHaveTextContent('Count: 5');
});

test('increments on click, via a REAL simulated user click', async () => {
  const user = userEvent.setup();
  render(<Counter startingValue={0} />);

  await user.click(screen.getByText('Increment'));
  expect(screen.getByTestId('count-display')).toHaveTextContent('Count: 1');

  await user.click(screen.getByText('Increment'));
  await user.click(screen.getByText('Increment'));
  expect(screen.getByTestId('count-display')).toHaveTextContent('Count: 3');
});

test('decrements on click', async () => {
  const user = userEvent.setup();
  render(<Counter startingValue={10} />);
  await user.click(screen.getByText('Decrement'));
  expect(screen.getByTestId('count-display')).toHaveTextContent('Count: 9');
});

test('reset returns to the ORIGINAL starting value, not zero', async () => {
  const user = userEvent.setup();
  render(<Counter startingValue={5} />);
  await user.click(screen.getByText('Increment'));
  await user.click(screen.getByText('Increment'));
  expect(screen.getByTestId('count-display')).toHaveTextContent('Count: 7');
  await user.click(screen.getByText('Reset'));
  expect(screen.getByTestId('count-display')).toHaveTextContent('Count: 5');
});
