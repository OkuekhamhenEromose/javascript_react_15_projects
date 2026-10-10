import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CounterBuggy from './CounterBuggy';

test('BUG DEMONSTRATION: direct mutation does NOT update the displayed UI', async () => {
  const user = userEvent.setup();
  render(<CounterBuggy />);

  expect(screen.getByTestId('count-display')).toHaveTextContent('Count: 0');

  await user.click(screen.getByText('Increment'));
  await user.click(screen.getByText('Increment'));
  await user.click(screen.getByText('Increment'));

  // Even after 3 clicks, the DISPLAYED count is still 0 - React never re-rendered
  expect(screen.getByTestId('count-display')).toHaveTextContent('Count: 0');
  console.log('Proven: 3 clicks happened, but the UI still shows Count: 0');
});
