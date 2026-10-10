import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TodoItemBuggy from './TodoItemBuggy';

test.fails('DEBUGGING EXERCISE: edit box should open PRE-FILLED with current text', async () => {
  const user = userEvent.setup();
  render(<TodoItemBuggy todo={{ id: 1, text: 'Buy milk', completed: false }} onEdit={() => {}} />);

  await user.click(screen.getByText('Edit'));
  const editInput = screen.getByLabelText('Edit Buy milk');

  console.log('Edit input value when box opens:', JSON.stringify(editInput.value));
  expect(editInput).toHaveValue('Buy milk'); // will FAIL - it's actually empty
});
