import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TemperatureConverter } from './TemperatureConverter';

test('FIX: typing in the input correctly updates the sibling display via lifted state', async () => {
  const user = userEvent.setup();
  render(<TemperatureConverter />);

  await user.type(screen.getByLabelText('Celsius'), '100');

  expect(screen.getByLabelText('Celsius')).toHaveValue('100');
  expect(screen.getByTestId('fahrenheit')).toHaveTextContent('Fahrenheit: 212');
});

test('updates correctly as the user keeps typing/changing the value', async () => {
  const user = userEvent.setup();
  render(<TemperatureConverter />);

  const input = screen.getByLabelText('Celsius');
  await user.type(input, '0');
  expect(screen.getByTestId('fahrenheit')).toHaveTextContent('Fahrenheit: 32');

  await user.clear(input);
  await user.type(input, '37');
  expect(screen.getByTestId('fahrenheit')).toHaveTextContent('Fahrenheit: 98.6');
});
