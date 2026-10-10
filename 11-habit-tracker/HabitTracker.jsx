import { useState } from 'react';
import { useLocalStorageState } from './useLocalStorageState';
import { getTodayString, calculateCurrentStreak, calculateLongestStreak } from './habitStats';

let nextId = 1;

function HabitTracker() {
  const [habits, setHabits] = useLocalStorageState('habits', []);
  const [newHabitName, setNewHabitName] = useState('');
  const today = getTodayString();

  function handleAddHabit(event) {
    event.preventDefault();
    const trimmed = newHabitName.trim();
    if (trimmed === '') return;
    setHabits([...habits, { id: nextId++, name: trimmed, completedDates: [] }]);
    setNewHabitName('');
  }

  function handleToggleToday(habitId) {
    setHabits(
      habits.map((habit) => {
        if (habit.id !== habitId) return habit;
        const isCompletedToday = habit.completedDates.includes(today);
        return {
          ...habit,
          completedDates: isCompletedToday
            ? habit.completedDates.filter((d) => d !== today)
            : [...habit.completedDates, today],
        };
      })
    );
  }

  return (
    <div>
      <h1>Habit Tracker</h1>
      <form onSubmit={handleAddHabit} noValidate>
        <label htmlFor="habit-name">New habit</label>
        <input id="habit-name" value={newHabitName} onChange={(e) => setNewHabitName(e.target.value)} />
        <button type="submit">Add habit</button>
      </form>

      {habits.length === 0 && <p>No habits yet.</p>}
      <ul>
        {habits.map((habit) => {
          const isCompletedToday = habit.completedDates.includes(today);
          const currentStreak = calculateCurrentStreak(habit.completedDates, today);
          const longestStreak = calculateLongestStreak(habit.completedDates);
          return (
            <li key={habit.id}>
              <h3>{habit.name}</h3>
              <button aria-pressed={isCompletedToday} onClick={() => handleToggleToday(habit.id)}>
                {isCompletedToday ? 'Done today ✓' : 'Mark done'}
              </button>
              <p data-testid={`streak-${habit.id}`}>
                Current streak: {currentStreak} day(s) — Longest: {longestStreak} day(s)
              </p>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default HabitTracker;
