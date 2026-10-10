import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DashboardBuggy from './DashboardBuggy';

test.fails('DEBUGGING EXERCISE: incrementing Coffees should NOT affect Water', async () => {
  const user = userEvent.setup();
  render(<DashboardBuggy />);

  await user.click(screen.getByLabelText('Increment Coffees'));
  await user.click(screen.getByLabelText('Increment Coffees'));

  console.log('Coffees count:', screen.getByText('Coffees').closest('div').textContent);
  console.log('Water count:', screen.getByText('Water').closest('div').textContent);

  expect(screen.getByText('Coffees').closest('div')).toHaveTextContent('Count: 2');
  expect(screen.getByText('Water').closest('div')).toHaveTextContent('Count: 0'); // will FAIL
});
