import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import GitHubUserSearch from './GitHubUserSearch';

test('shows idle state with no input', () => {
  render(<GitHubUserSearch fetchUser={vi.fn()} />);
  expect(screen.getByText('Type a username to search.')).toBeInTheDocument();
});

test('debounces input and shows loading, then success, using an injected mock fetcher', async () => {
  vi.useFakeTimers({ shouldAdvanceTime: true });
  const mockFetch = vi.fn().mockResolvedValue({ login: 'torvalds', public_repos: 10, followers: 5000 });
  const user = userEvent.setup({ delay: null });

  render(<GitHubUserSearch fetchUser={mockFetch} />);
  await user.type(screen.getByLabelText('GitHub username'), 'torvalds');

  // Debounce hasn't settled - the mock should NOT have been called on every keystroke
  expect(mockFetch).not.toHaveBeenCalled();

  await act(async () => { await vi.advanceTimersByTimeAsync(450); });

  // Called exactly ONCE, with the FULL final value - not once per keystroke
  expect(mockFetch).toHaveBeenCalledTimes(1);
  expect(mockFetch).toHaveBeenCalledWith('torvalds');
  expect(screen.getByTestId('user-result')).toHaveTextContent('torvalds');
  expect(screen.getByTestId('user-result')).toHaveTextContent('10 public repos');

  vi.useRealTimers();
});

test('shows an error state when the mock fetcher rejects', async () => {
  vi.useFakeTimers({ shouldAdvanceTime: true });
  const mockFetch = vi.fn().mockRejectedValue(new Error('404 Not Found'));
  const user = userEvent.setup({ delay: null });

  render(<GitHubUserSearch fetchUser={mockFetch} />);
  await user.type(screen.getByLabelText('GitHub username'), 'zzz-nonexistent');

  await act(async () => { await vi.advanceTimersByTimeAsync(450); });

  expect(screen.getByRole('alert')).toHaveTextContent('404 Not Found');

  vi.useRealTimers();
});

test('race condition protection: a slow stale search does not overwrite a fresh one', async () => {
  vi.useFakeTimers({ shouldAdvanceTime: true });
  const mockFetch = vi.fn()
    .mockImplementationOnce(() => new Promise((resolve) => setTimeout(() => resolve({ login: 'slow-user', public_repos: 1, followers: 1 }), 1000)))
    .mockImplementationOnce(() => new Promise((resolve) => setTimeout(() => resolve({ login: 'fast-user', public_repos: 2, followers: 2 }), 100)));

  const user = userEvent.setup({ delay: null });
  render(<GitHubUserSearch fetchUser={mockFetch} />);

  await user.type(screen.getByLabelText('GitHub username'), 'slow');
  await act(async () => { await vi.advanceTimersByTimeAsync(400); }); // let debounce fire for "slow"

  await user.clear(screen.getByLabelText('GitHub username'));
  await user.type(screen.getByLabelText('GitHub username'), 'fast');
  await act(async () => { await vi.advanceTimersByTimeAsync(400); }); // let debounce fire for "fast"

  await act(async () => { await vi.advanceTimersByTimeAsync(150); }); // fast-user's 100ms request resolves
  expect(screen.getByTestId('user-result')).toHaveTextContent('fast-user');

  await act(async () => { await vi.advanceTimersByTimeAsync(900); }); // slow-user's stale 1000ms request finally resolves
  expect(screen.getByTestId('user-result')).toHaveTextContent('fast-user'); // still correct - not overwritten

  vi.useRealTimers();
});

// --- A genuine, LIVE test against the real GitHub API - not mocked ---
// Given this course's history with this exact API (Snippet 26/27), the honest expectation
// is that this MAY hit the same exhausted rate limit. Either real outcome is handled correctly.
test('LIVE API: real fetch against api.github.com resolves to a defined status, not a crash', async () => {
  render(<GitHubUserSearch />); // no injected fetcher - uses the REAL githubApi.js

  const user = userEvent.setup();
  await user.type(screen.getByLabelText('GitHub username'), 'torvalds');

  await new Promise((r) => setTimeout(r, 600)); // real wall-clock wait for the real debounce + real network

  const stateAfterWait = screen.queryByTestId('user-result') ? 'success' : screen.queryByRole('alert') ? 'error' : 'still-loading';
  console.log('LIVE API result state:', stateAfterWait);
  console.log('LIVE API page content:', document.body.textContent);

  expect(['success', 'error']).toContain(stateAfterWait); // must resolve to ONE of these - never crash, never hang
}, 10000);
