import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LazyLoadDemo } from './LazyLoadDemo';

test('the lazy component is NOT in the DOM before being requested', () => {
  render(<LazyLoadDemo />);
  expect(screen.queryByTestId('heavy-panel')).not.toBeInTheDocument();
});

test('clicking the button eventually renders the lazy-loaded component', async () => {
  const user = userEvent.setup();
  render(<LazyLoadDemo />);

  await user.click(screen.getByText('Show heavy panel'));

  // findBy* polls until the async import resolves and HeavyPanel actually renders -
  // proving the dynamic import genuinely completed, not just that we requested it.
  expect(await screen.findByTestId('heavy-panel')).toBeInTheDocument();
  expect(screen.getByText('Heavy panel content loaded.')).toBeInTheDocument();
});
