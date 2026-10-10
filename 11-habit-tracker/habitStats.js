export function formatDate(date) {
  return date.toISOString().split('T')[0]; // "YYYY-MM-DD"
}

export function getTodayString() {
  return formatDate(new Date());
}

function subtractDays(dateStr, days) {
  const date = new Date(dateStr + 'T00:00:00Z');
  date.setUTCDate(date.getUTCDate() - days);
  return formatDate(date);
}

// Walks backward from today, counting consecutive completed days.
// Deliberately a PURE function - no dependency on component state, easy to unit test in isolation.
export function calculateCurrentStreak(completedDates, todayStr = getTodayString()) {
  const completedSet = new Set(completedDates);
  let streak = 0;
  let checkDate = todayStr;

  // If today itself isn't done yet, the streak might still be "alive" via yesterday -
  // start checking from today, but don't REQUIRE today to have a non-zero streak.
  while (completedSet.has(checkDate)) {
    streak++;
    checkDate = subtractDays(checkDate, 1);
  }
  return streak;
}

export function calculateLongestStreak(completedDates) {
  if (completedDates.length === 0) return 0;
  const sorted = [...completedDates].sort();
  let longest = 1;
  let current = 1;

  for (let i = 1; i < sorted.length; i++) {
    const prevDate = new Date(sorted[i - 1] + 'T00:00:00Z');
    const currDate = new Date(sorted[i] + 'T00:00:00Z');
    const dayDiff = (currDate - prevDate) / (1000 * 60 * 60 * 24);

    if (dayDiff === 1) {
      current++;
      longest = Math.max(longest, current);
    } else if (dayDiff > 1) {
      current = 1; // gap - streak resets
    }
    // dayDiff === 0 (duplicate date) is ignored - doesn't extend or reset
  }
  return longest;
}
