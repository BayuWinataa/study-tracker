export interface StreakCalculationResult {
  currentStreak: number;
  freezeAvailable: number;
  freezeUsed: boolean;
  status: 'IDEMPOTENT' | 'INCREASED' | 'FROZEN' | 'BROKEN';
}

/**
 * Calculates new streak based on the dates.
 * Dates are expected to be normalized to start of day in the same timezone.
 */
export function calculateNewStreak(
  lastCheckInDate: Date | null,
  currentDate: Date,
  currentStreak: number,
  freezeAvailable: number
): StreakCalculationResult {
  // First check-in ever
  if (!lastCheckInDate) {
    return {
      currentStreak: 1,
      freezeAvailable,
      freezeUsed: false,
      status: 'INCREASED',
    };
  }

  const msPerDay = 24 * 60 * 60 * 1000;
  const diffTime = currentDate.getTime() - lastCheckInDate.getTime();
  const diffDays = Math.round(diffTime / msPerDay);

  if (diffDays <= 0) {
    // Already checked in today
    return {
      currentStreak,
      freezeAvailable,
      freezeUsed: false,
      status: 'IDEMPOTENT',
    };
  } else if (diffDays === 1) {
    // Checked in yesterday, normal streak continuation
    return {
      currentStreak: currentStreak + 1,
      freezeAvailable,
      freezeUsed: false,
      status: 'INCREASED',
    };
  } else if (diffDays === 2) {
    // Missed yesterday
    if (freezeAvailable > 0) {
      return {
        currentStreak: currentStreak + 1,
        freezeAvailable: freezeAvailable - 1,
        freezeUsed: true,
        status: 'FROZEN',
      };
    } else {
      // Missed yesterday but no freeze available
      return {
        currentStreak: 1,
        freezeAvailable,
        freezeUsed: false,
        status: 'BROKEN',
      };
    }
  } else {
    // Missed more than 1 day
    return {
      currentStreak: 1,
      freezeAvailable,
      freezeUsed: false,
      status: 'BROKEN',
    };
  }
}
