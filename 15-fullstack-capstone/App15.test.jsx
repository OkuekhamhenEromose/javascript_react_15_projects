import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { vi } from 'vitest';
import { AuthProvider } from './AuthContext';
import { LoginPage, RequireAuth, TaskDetailPage } from './App15';
import TaskListPage from './TaskListPage';
import { setForceNextPatchToFail, resetTasksForTesting } from './taskApi';

beforeEach(() => {
  localStorage.clear();
  resetTasksForTesting(); // prevent one test's mutations from leaking into the next
});

function renderAtRoute(initialRoute) {
  return render(
    <AuthProvider>
      <MemoryRouter initialEntries={[initialRoute]}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<RequireAuth><TaskListPage /></RequireAuth>} />
          <Route path="/tasks/:id" element={<RequireAuth><TaskDetailPage /></RequireAuth>} />
        </Routes>
      </MemoryRouter>
    </AuthProvider>
  );
}

test('PROTECTED ROUTE: an unauthenticated user visiting "/" is redirected to the login page', () => {
  renderAtRoute('/');
  expect(screen.getByLabelText('Username')).toBeInTheDocument(); // login form, not the task list
});

test('an authenticated user (restored session) can access the task list directly', async () => {
  localStorage.setItem('mock_auth_token', 'fake-token-for-amara');
  renderAtRoute('/');

  expect(await screen.findByText('Design the dashboard layout')).toBeInTheDocument();
});

test('route params work: visiting /tasks/2 shows the correct specific task', async () => {
  localStorage.setItem('mock_auth_token', 'fake-token-for-amara');
  renderAtRoute('/tasks/2');

  expect(await screen.findByText('Write API documentation')).toBeInTheDocument();
  expect(screen.getByText('Status: Completed')).toBeInTheDocument();
});

test('OPTIMISTIC UPDATE: toggling a task updates the UI IMMEDIATELY, before the server confirms', async () => {
  localStorage.setItem('mock_auth_token', 'fake-token-for-amara');
  const user = userEvent.setup();
  renderAtRoute('/');

  const checkbox = await screen.findByLabelText('Mark Design the dashboard layout as complete');
  expect(checkbox).not.toBeChecked();

  await user.click(checkbox);

  // Checked IMMEDIATELY - the mock server's 150ms delay hasn't even elapsed yet
  expect(checkbox).toBeChecked();

  // Wait for the underlying request to fully settle before the test ends - otherwise
  // this pending mock timer fires DURING the next test, corrupting its shared
  // forceNextPatchToFail flag (a real, genuine test-isolation bug, caught live).
  await new Promise((r) => setTimeout(r, 200));
});

test('ROLLBACK: a failed save reverts the optimistic update and shows an error', async () => {
  localStorage.setItem('mock_auth_token', 'fake-token-for-amara');
  setForceNextPatchToFail(true); // configure the mock to reject the NEXT patch
  const user = userEvent.setup();
  renderAtRoute('/');

  const checkbox = await screen.findByLabelText('Mark Design the dashboard layout as complete');
  await user.click(checkbox);

  expect(checkbox).toBeChecked(); // optimistically checked immediately

  // Wait for the mock's rejection to actually arrive
  await screen.findByRole('alert');

  expect(screen.getByRole('alert')).toHaveTextContent('Could not update "Design the dashboard layout"');
  expect(checkbox).not.toBeChecked(); // ROLLED BACK to its original state
});
