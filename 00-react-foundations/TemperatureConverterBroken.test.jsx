import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TemperatureConverterBroken } from './TemperatureConverterBroken';

test('BUG: typing in one sibling does NOT update the other sibling', async () => {
  const user = userEvent.setup();
  render(<TemperatureConverterBroken />);

  await user.type(screen.getByLabelText('Celsius'), '100');

  // Celsius input correctly shows 100 (its own local state works fine)
  expect(screen.getByLabelText('Celsius')).toHaveValue('100');

  // But the sibling display has NO access to that value - it's stuck showing nothing
  console.log('Fahrenheit display content:', screen.getByTestId('fahrenheit-broken').textContent);
  expect(screen.getByTestId('fahrenheit-broken')).toHaveTextContent('Fahrenheit:');
  expect(screen.getByTestId('fahrenheit-broken')).not.toHaveTextContent('212'); // 100C = 212F, never shown
});
