import type { Puzzle, PuzzleData } from '../types';

// Set to true to always show puzzle #1 for testing
const DEV_FORCE_PUZZLE_ONE = true;

/**
 * Gets the current puzzle based on days elapsed since the start date.
 * Puzzles cycle through the available puzzles array.
 * The puzzle id is computed from the array index (index 0 = puzzle #1).
 */
export function getDailyPuzzle(puzzleData: PuzzleData): Puzzle {
  // Dev override: always show first puzzle
  if (DEV_FORCE_PUZZLE_ONE) {
    const puzzleJson = puzzleData.puzzles[0];
    return {
      ...puzzleJson,
      id: 1,
    };
  }

  const startDate = new Date(puzzleData.startDate);
  const now = new Date();

  // Adjust for EST timezone (UTC-5)
  const estOffset = -5 * 60; // EST is UTC-5
  const localOffset = now.getTimezoneOffset();
  const estTime = new Date(now.getTime() + (localOffset - estOffset) * 60 * 1000);

  // Reset to midnight EST
  estTime.setHours(0, 0, 0, 0);
  startDate.setHours(0, 0, 0, 0);

  // Calculate days elapsed
  const msPerDay = 24 * 60 * 60 * 1000;
  const daysElapsed = Math.floor((estTime.getTime() - startDate.getTime()) / msPerDay);

  // Get puzzle index (cycle through available puzzles)
  const puzzleIndex = Math.max(0, daysElapsed % puzzleData.puzzles.length);

  // Return the puzzle with id based on days elapsed (puzzle #1 on day 1, etc.)
  const puzzleJson = puzzleData.puzzles[puzzleIndex];
  return {
    ...puzzleJson,
    id: daysElapsed + 1, // Puzzle numbers start at 1
  };
}

/**
 * Gets the puzzle number for today
 */
export function getTodayPuzzleNumber(startDate: string): number {
  const start = new Date(startDate);
  const now = new Date();

  // Adjust for EST timezone
  const estOffset = -5 * 60;
  const localOffset = now.getTimezoneOffset();
  const estTime = new Date(now.getTime() + (localOffset - estOffset) * 60 * 1000);

  estTime.setHours(0, 0, 0, 0);
  start.setHours(0, 0, 0, 0);

  const msPerDay = 24 * 60 * 60 * 1000;
  const daysElapsed = Math.floor((estTime.getTime() - start.getTime()) / msPerDay);

  return daysElapsed + 1;
}
