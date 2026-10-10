import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import MovieSearchBuggy from './MovieSearchBuggy';

async function search(user, text) {
  await user.type(screen.getByLabelText('Search movies'), text);
  await act(async () => { await vi.advanceTimersByTimeAsync(150); });
  await act(async () => { await vi.advanceTimersByTimeAsync(150); });
  await act(async () => { await vi.advanceTimersByTimeAsync(150); });
  await act(async () => { await vi.advanceTimersByTimeAsync(150); });
}

beforeEach(() => { vi.useFakeTimers({ shouldAdvanceTime: true }); });
afterEach(() => { vi.useRealTimers(); });

test.fails('DEBUGGING EXERCISE: missing page reset shows an incorrect, empty-looking page for a new search', async () => {
  const user = userEvent.setup({ delay: null });
  render(<MovieSearchBuggy />);

  await search(user, 'the'); // 5 matches, 2 pages
  await user.click(screen.getByText('Next'));
  await act(async () => { await vi.advanceTimersByTimeAsync(125); });
  await act(async () => { await vi.advanceTimersByTimeAsync(125); });
  console.log('On page 2 of "the":', screen.getByTestId('page-indicator').textContent);

  await user.clear(screen.getByLabelText('Search movies'));
  await search(user, 'inception'); // only 1 match, 1 page - but we're STILL "on page 2" internally

  console.log('After searching "inception" while stuck on page 2:', document.body.textContent);
  // Expected: Page 1 of 1, showing Inception.
  // Actual (bug): requests page 2 of a 1-page result set, which is empty.
  expect(screen.getByTestId('page-indicator')).toHaveTextContent('Page 1 of 1'); // will FAIL
});
