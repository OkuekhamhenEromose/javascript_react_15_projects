import { render, screen } from '@testing-library/react';
import Greeting from './Greeting';

test('renders the name passed as a prop', () => {
  render(<Greeting name="Amara" unreadCount={0} />);
  expect(screen.getByText('Hello, Amara!')).toBeInTheDocument();
});

test('shows unread count message when count > 0', () => {
  render(<Greeting name="Zainab" unreadCount={3} />);
  expect(screen.getByText('You have 3 unread messages.')).toBeInTheDocument();
});

test('does NOT show unread message when count is 0', () => {
  render(<Greeting name="Chidi" unreadCount={0} />);
  expect(screen.queryByText(/unread messages/)).not.toBeInTheDocument();
});
