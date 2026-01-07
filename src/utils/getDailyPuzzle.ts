import type { Puzzle, PuzzleData } from '../types';

/**
 * Gets the current puzzle based on days elapsed since the start date.
 * Puzzles cycle through the available puzzles array.
 */
export function getDailyPuzzle(puzzleData: PuzzleData): Puzzle {
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

  // Return the puzzle with an adjusted ID to reflect the actual day number
  const puzzle = puzzleData.puzzles[puzzleIndex];
  return {
    ...puzzle,
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
