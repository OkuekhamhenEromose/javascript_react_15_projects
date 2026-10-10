import { useState, useEffect } from 'react';
import { QUESTIONS } from './quizData';

const TIME_PER_QUESTION = 10; // seconds

function QuizApp() {
  const [status, setStatus] = useState('idle'); // "idle" | "playing" | "finished"
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(TIME_PER_QUESTION);

  const currentQuestion = QUESTIONS[currentIndex];

  function goToNextQuestion() {
    if (currentIndex + 1 < QUESTIONS.length) {
      setCurrentIndex(currentIndex + 1);
      setTimeLeft(TIME_PER_QUESTION);
    } else {
      setStatus('finished');
    }
  }

  function handleAnswer(selectedIndex) {
    if (selectedIndex === currentQuestion.correctIndex) {
      setScore((s) => s + 1);
    }
    goToNextQuestion();
  }

  function handleStart() {
    setStatus('playing');
    setCurrentIndex(0);
    setScore(0);
    setTimeLeft(TIME_PER_QUESTION);
  }

  // Recurring countdown timer - only runs while playing.
  useEffect(() => {
    if (status !== 'playing') return; // don't start a timer when not playing

    const intervalId = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          return 0; // let the effect below handle advancing, to avoid updating unrelated state mid-tick
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(intervalId); // CRITICAL - prevents overlapping timers across question changes
  }, [status, currentIndex]);

  // Auto-advance when time runs out - separate effect, reacting to timeLeft hitting 0
  useEffect(() => {
    if (status === 'playing' && timeLeft === 0) {
      goToNextQuestion();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft, status]);

  if (status === 'idle') {
    return (
      <div>
        <h1>Quiz</h1>
        <button onClick={handleStart}>Start Quiz</button>
      </div>
    );
  }

  if (status === 'finished') {
    return (
      <div>
        <h1>Quiz Complete</h1>
        <p data-testid="final-score">Score: {score} / {QUESTIONS.length}</p>
        <button onClick={handleStart}>Restart</button>
      </div>
    );
  }

  return (
    <div>
      <p data-testid="time-left">Time left: {timeLeft}s</p>
      <p data-testid="question-progress">Question {currentIndex + 1} of {QUESTIONS.length}</p>
      <h2>{currentQuestion.question}</h2>
      <ul>
        {currentQuestion.options.map((option, index) => (
          <li key={option}>
            <button onClick={() => handleAnswer(index)}>{option}</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default QuizApp;
