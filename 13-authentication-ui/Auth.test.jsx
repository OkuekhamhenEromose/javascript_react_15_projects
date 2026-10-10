import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { AuthProvider, useAuth } from './AuthContext';
import { AuthApp } from './AuthComponents';

beforeEach(() => {
  localStorage.clear();
});

function renderApp() {
  return render(
    <AuthProvider>
      <AuthApp />
    </AuthProvider>
  );
}

test('protected content is hidden and login form is shown when logged out', () => {
  renderApp();
  expect(screen.getByText('Please log in to view this content.')).toBeInTheDocument();
  expect(screen.queryByTestId('secret-content')).not.toBeInTheDocument();
});

test('logging in with correct credentials reveals protected content', async () => {
  vi.useFakeTimers({ shouldAdvanceTime: true });
  const user = userEvent.setup({ delay: null });
  renderApp();

  await user.type(screen.getByLabelText('Username'), 'amara');
  await user.type(screen.getByLabelText('Password'), 'correcthorse123');
  await user.click(screen.getByText('Log in'));

  await act(async () => { await vi.advanceTimersByTimeAsync(450); });

  expect(screen.getByText('Welcome, Amara Okafor!')).toBeInTheDocument();
  expect(screen.getByTestId('secret-content')).toBeInTheDocument();

  vi.useRealTimers();
});

test('logging in with WRONG credentials shows an error and does NOT reveal content', async () => {
  vi.useFakeTimers({ shouldAdvanceTime: true });
  const user = userEvent.setup({ delay: null });
  renderApp();

  await user.type(screen.getByLabelText('Username'), 'amara');
  await user.type(screen.getByLabelText('Password'), 'wrongpassword');
  await user.click(screen.getByText('Log in'));

  await act(async () => { await vi.advanceTimersByTimeAsync(450); });

  expect(screen.getByRole('alert')).toHaveTextContent('Invalid username or password');
  expect(screen.queryByTestId('secret-content')).not.toBeInTheDocument();

  vi.useRealTimers();
});

test('logging out hides protected content again and clears the stored token', async () => {
  vi.useFakeTimers({ shouldAdvanceTime: true });
  const user = userEvent.setup({ delay: null });
  renderApp();

  await user.type(screen.getByLabelText('Username'), 'amara');
  await user.type(screen.getByLabelText('Password'), 'correcthorse123');
  await user.click(screen.getByText('Log in'));
  await act(async () => { await vi.advanceTimersByTimeAsync(450); });

  expect(screen.getByTestId('secret-content')).toBeInTheDocument();

  await user.click(screen.getByText('Log out'));

  expect(screen.getByText('Please log in to view this content.')).toBeInTheDocument();
  expect(localStorage.getItem('mock_auth_token')).toBeNull();

  vi.useRealTimers();
});

test('a previously stored token restores a logged-in session on mount', () => {
  localStorage.setItem('mock_auth_token', 'fake-token-for-amara');
  renderApp();
  expect(screen.getByText('Welcome, Restored Session!')).toBeInTheDocument();
});

test('useAuth throws a clear error when used outside an AuthProvider', () => {
  const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
  function BadComponent() {
    useAuth();
    return null;
  }
  expect(() => render(<BadComponent />)).toThrow('useAuth must be used within an AuthProvider');
  consoleError.mockRestore();
});
