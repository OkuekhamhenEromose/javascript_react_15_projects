import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SignupForm from './SignupForm';
import { vi } from 'vitest';

test('input value reflects what the user types (controlled input)', async () => {
  const user = userEvent.setup();
  render(<SignupForm onSubmit={() => {}} />);

  const emailInput = screen.getByLabelText('Email');
  await user.type(emailInput, 'amara@example.com');

  expect(emailInput).toHaveValue('amara@example.com');
});

test('shows validation errors and does NOT call onSubmit for invalid data', async () => {
  const user = userEvent.setup();
  const handleSubmit = vi.fn(); // a real spy function to prove it was or wasn't called
  render(<SignupForm onSubmit={handleSubmit} />);

  await user.type(screen.getByLabelText('Email'), 'not-an-email');
  await user.type(screen.getByLabelText('Password'), 'short');
  await user.click(screen.getByText('Sign up'));

  expect(screen.getByTestId('error-list')).toBeInTheDocument();
  expect(screen.getByText('Email must be valid.')).toBeInTheDocument();
  expect(screen.getByText('Password must be at least 8 characters.')).toBeInTheDocument();
  expect(handleSubmit).not.toHaveBeenCalled(); // proves invalid submission was genuinely blocked
});

test('calls onSubmit with the correct data for valid input', async () => {
  const user = userEvent.setup();
  const handleSubmit = vi.fn();
  render(<SignupForm onSubmit={handleSubmit} />);

  await user.type(screen.getByLabelText('Email'), 'amara@example.com');
  await user.type(screen.getByLabelText('Password'), 'strongpass1');
  await user.click(screen.getByText('Sign up'));

  expect(handleSubmit).toHaveBeenCalledWith({
    email: 'amara@example.com',
    password: 'strongpass1',
  });
  expect(screen.queryByTestId('error-list')).not.toBeInTheDocument();
});
