import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TaskListIndexKey, TaskListStableKey } from './KeyDemo';

test('BUG: index-as-key - typed note STAYS AT POSITION 0, not with the task it was typed for', async () => {
  const user = userEvent.setup();
  const { rerender } = render(<TaskListIndexKey tasks={['Buy milk', 'Walk dog']} />);

  // Type a note into "Buy milk" (currently at index 0)
  const input = screen.getByLabelText('note-for-Buy milk');
  await user.type(input, 'urgent');
  expect(screen.getByLabelText('note-for-Buy milk')).toHaveValue('urgent');

  // Now re-render with a NEW task inserted at the FRONT of the list
  rerender(<TaskListIndexKey tasks={['Walk dog', 'Buy milk']} />);

  // "Buy milk" is now at index 1, "Walk dog" is now at index 0.
  // Because the key is the INDEX, React thinks "index 0" is still the SAME component -
  // so the typed note incorrectly STAYS attached to index 0, which is now "Walk dog"!
  const walkDogInput = screen.getByLabelText('note-for-Walk dog');
  const buyMilkInput = screen.getByLabelText('note-for-Buy milk');

  console.log('Walk dog input value (BUG - inherited the note):', walkDogInput.value);
  console.log('Buy milk input value (BUG - lost its own note):', buyMilkInput.value);

  expect(walkDogInput).toHaveValue('urgent'); // WRONG task now has the note
  expect(buyMilkInput).toHaveValue('');       // original task LOST its note
});

test('FIX: stable key - typed note correctly FOLLOWS the task, regardless of position', async () => {
  const user = userEvent.setup();
  const { rerender } = render(<TaskListStableKey tasks={['Buy milk', 'Walk dog']} />);

  const input = screen.getByLabelText('note-for-Buy milk');
  await user.type(input, 'urgent');
  expect(screen.getByLabelText('note-for-Buy milk')).toHaveValue('urgent');

  // Reorder - "Buy milk" moves to a new position
  rerender(<TaskListStableKey tasks={['Walk dog', 'Buy milk']} />);

  const walkDogInput = screen.getByLabelText('note-for-Walk dog');
  const buyMilkInput = screen.getByLabelText('note-for-Buy milk');

  console.log('Walk dog input value (correct - never had a note):', walkDogInput.value);
  console.log('Buy milk input value (correct - note followed it):', buyMilkInput.value);

  expect(buyMilkInput).toHaveValue('urgent'); // note correctly followed the task
  expect(walkDogInput).toHaveValue('');       // unaffected
});
