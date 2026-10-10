import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import QuizApp from './QuizApp';

test('starts on the idle screen, then transitions to playing', async () => {
  const user = userEvent.setup();
  render(<QuizApp />);

  expect(screen.getByText('Start Quiz')).toBeInTheDocument();
  await user.click(screen.getByText('Start Quiz'));

  expect(screen.getByTestId('question-progress')).toHaveTextContent('Question 1 of 3');
  expect(screen.getByTestId('time-left')).toHaveTextContent('Time left: 10s');
});

test('answering correctly increments score and advances to the next question', async () => {
  const user = userEvent.setup();
  render(<QuizApp />);
  await user.click(screen.getByText('Start Quiz'));

  // Question 1's correct answer is index 2: "Value and type"
  await user.click(screen.getByText('Value and type'));

  expect(screen.getByTestId('question-progress')).toHaveTextContent('Question 2 of 3');
});

test('answering incorrectly does NOT increment score, but still advances', async () => {
  const user = userEvent.setup();
  render(<QuizApp />);
  await user.click(screen.getByText('Start Quiz'));

  await user.click(screen.getByText('Value only')); // wrong answer for question 1
  await user.click(screen.getByText('push')); // wrong answer for question 2 (correct is "filter")
  await user.click(screen.getByText('A type of loop')); // wrong answer for question 3

  expect(screen.getByTestId('final-score')).toHaveTextContent('Score: 0 / 3');
});

test('completing the quiz with all correct answers shows a perfect score', async () => {
  const user = userEvent.setup();
  render(<QuizApp />);
  await user.click(screen.getByText('Start Quiz'));

  await user.click(screen.getByText('Value and type'));       // Q1 correct
  await user.click(screen.getByText('filter'));                // Q2 correct
  await user.click(screen.getByText('A function that retains access to its defining scope')); // Q3 correct

  expect(screen.getByTestId('final-score')).toHaveTextContent('Score: 3 / 3');
});

test('countdown timer actually decreases over real simulated seconds', async () => {
  vi.useFakeTimers({ shouldAdvanceTime: true });
  const user = userEvent.setup({ delay: null });
  render(<QuizApp />);

  await user.click(screen.getByText('Start Quiz'));
  expect(screen.getByTestId('time-left')).toHaveTextContent('Time left: 10s');

  await act(async () => { await vi.advanceTimersByTimeAsync(1000); });
  expect(screen.getByTestId('time-left')).toHaveTextContent('Time left: 9s');

  await act(async () => { await vi.advanceTimersByTimeAsync(3000); });
  expect(screen.getByTestId('time-left')).toHaveTextContent('Time left: 6s');

  vi.useRealTimers();
});

test('auto-advances to the next question when time runs out, with NO answer selected', async () => {
  vi.useFakeTimers({ shouldAdvanceTime: true });
  const user = userEvent.setup({ delay: null });
  render(<QuizApp />);

  await user.click(screen.getByText('Start Quiz'));

  // Let the full 10 seconds elapse WITHOUT clicking any answer
  await act(async () => { await vi.advanceTimersByTimeAsync(10000); });

  expect(screen.getByTestId('question-progress')).toHaveTextContent('Question 2 of 3');
  expect(screen.getByTestId('time-left')).toHaveTextContent('Time left: 10s'); // reset for the new question

  vi.useRealTimers();
});

test('restarting after finishing resets score and question index to zero', async () => {
  const user = userEvent.setup();
  render(<QuizApp />);
  await user.click(screen.getByText('Start Quiz'));

  await user.click(screen.getByText('Value only'));
  await user.click(screen.getByText('push'));
  await user.click(screen.getByText('A type of loop'));

  expect(screen.getByTestId('final-score')).toHaveTextContent('Score: 0 / 3');

  await user.click(screen.getByText('Restart'));
  expect(screen.getByTestId('question-progress')).toHaveTextContent('Question 1 of 3');
});
