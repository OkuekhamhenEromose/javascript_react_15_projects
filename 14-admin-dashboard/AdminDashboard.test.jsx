import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AdminDashboard from './AdminDashboard';

test('renders the role chart with correct counts derived from the data', () => {
  render(<AdminDashboard />);
  // 3 Admins? Let's check actual data: Admin x2 (Amara, Tunde), Editor x2 (Zainab, Kwame), Viewer x3
  expect(screen.getByLabelText('Admin: 2 users')).toBeInTheDocument();
  expect(screen.getByLabelText('Editor: 2 users')).toBeInTheDocument();
  expect(screen.getByLabelText('Viewer: 3 users')).toBeInTheDocument();
});

test('table is sorted by name ascending by default, paginated to 3 per page', () => {
  render(<AdminDashboard />);
  const rows = screen.getAllByRole('row').slice(1); // skip header row
  expect(rows).toHaveLength(3);
  expect(within(rows[0]).getByText('Amara Okafor')).toBeInTheDocument(); // alphabetically first
});

test('clicking a column header sorts by that column, clicking again reverses direction', async () => {
  const user = userEvent.setup();
  render(<AdminDashboard />);

  await user.click(screen.getByText(/^role/));
  let rows = screen.getAllByRole('row').slice(1);
  expect(within(rows[0]).getByText(/Admin/)).toBeInTheDocument(); // "Admin" sorts first alphabetically

  await user.click(screen.getByText(/^role/)); // click again - reverse to descending
  rows = screen.getAllByRole('row').slice(1);
  expect(within(rows[0]).getByText(/Viewer/)).toBeInTheDocument(); // "Viewer" sorts first descending
});

test('searching filters the table and resets to page 1', async () => {
  const user = userEvent.setup();
  render(<AdminDashboard />);

  await user.click(screen.getByText('Next')); // go to page 2 first
  expect(screen.getByTestId('page-indicator')).toHaveTextContent('Page 2 of 3');

  await user.type(screen.getByLabelText('Search users'), 'Zainab');

  expect(screen.getByTestId('page-indicator')).toHaveTextContent('Page 1 of 1');
  expect(screen.getByText('Zainab Bello')).toBeInTheDocument();
  expect(screen.queryByText('Amara Okafor')).not.toBeInTheDocument();
});

test('shows an empty state when no users match the search', async () => {
  const user = userEvent.setup();
  render(<AdminDashboard />);

  await user.type(screen.getByLabelText('Search users'), 'zzz-nonexistent');
  expect(screen.getByText('No users match your search.')).toBeInTheDocument();
});

test('pagination Next/Previous navigate correctly and disable at boundaries', async () => {
  const user = userEvent.setup();
  render(<AdminDashboard />);

  expect(screen.getByText('Previous')).toBeDisabled();

  await user.click(screen.getByText('Next'));
  await user.click(screen.getByText('Next'));
  expect(screen.getByTestId('page-indicator')).toHaveTextContent('Page 3 of 3');
  expect(screen.getByText('Next')).toBeDisabled();
});
