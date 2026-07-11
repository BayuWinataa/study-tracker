import { describe, it, expect } from 'vitest';
import { calculateNewStreak } from '../streak-logic';

describe('calculateNewStreak', () => {
  it('should start streak at 1 if no lastCheckInDate', () => {
    const result = calculateNewStreak(null, new Date('2024-01-10T00:00:00Z'), 0, 1);
    expect(result.currentStreak).toBe(1);
    expect(result.status).toBe('INCREASED');
  });

  it('should return IDEMPOTENT if already checked in today', () => {
    const today = new Date('2024-01-10T00:00:00Z');
    const result = calculateNewStreak(today, today, 5, 1);
    expect(result.currentStreak).toBe(5);
    expect(result.status).toBe('IDEMPOTENT');
  });

  it('should increment streak if checked in yesterday', () => {
    const yesterday = new Date('2024-01-09T00:00:00Z');
    const today = new Date('2024-01-10T00:00:00Z');
    const result = calculateNewStreak(yesterday, today, 5, 1);
    expect(result.currentStreak).toBe(6);
    expect(result.status).toBe('INCREASED');
  });

  it('should save streak and consume freeze if missed 1 day and freeze available', () => {
    const twoDaysAgo = new Date('2024-01-08T00:00:00Z');
    const today = new Date('2024-01-10T00:00:00Z');
    const result = calculateNewStreak(twoDaysAgo, today, 5, 1);
    expect(result.currentStreak).toBe(6);
    expect(result.freezeAvailable).toBe(0);
    expect(result.freezeUsed).toBe(true);
    expect(result.status).toBe('FROZEN');
  });

  it('should break streak if missed 1 day and no freeze available', () => {
    const twoDaysAgo = new Date('2024-01-08T00:00:00Z');
    const today = new Date('2024-01-10T00:00:00Z');
    const result = calculateNewStreak(twoDaysAgo, today, 5, 0);
    expect(result.currentStreak).toBe(1);
    expect(result.freezeAvailable).toBe(0);
    expect(result.freezeUsed).toBe(false);
    expect(result.status).toBe('BROKEN');
  });

  it('should break streak if missed more than 1 day even with freeze available', () => {
    const threeDaysAgo = new Date('2024-01-07T00:00:00Z');
    const today = new Date('2024-01-10T00:00:00Z');
    const result = calculateNewStreak(threeDaysAgo, today, 5, 1);
    expect(result.currentStreak).toBe(1);
    expect(result.status).toBe('BROKEN');
  });
});
