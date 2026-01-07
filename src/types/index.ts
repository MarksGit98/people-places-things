export type ColumnType = 'people' | 'places' | 'things';

export interface Cell {
  clue: string;
  answer: string;
  imageUrl?: string;
}

export interface Row {
  constraint: string;
  cells: [Cell, Cell, Cell]; // Always 3 cells: People, Places, Things
}

export interface Puzzle {
  id: number;
  rows: [Row, Row, Row]; // Always 3 rows
}

export interface PuzzleData {
  puzzles: Puzzle[];
  startDate: string; // ISO date string for puzzle #1
}

export type CellStatus = 'unanswered' | 'correct' | 'incorrect';

export interface CellState {
  guesses: string[];
  status: CellStatus;
  guessesRemaining: number;
}

export type GameStatus = 'playing' | 'completed';

export interface GameState {
  puzzleId: number;
  cells: CellState[][]; // 3x3 grid of cell states
  gameStatus: GameStatus;
  startedAt: string;
  completedAt?: string;
}

export interface ShareResult {
  puzzleNumber: number;
  grid: ('green' | 'yellow' | 'orange' | 'red')[][];
  correctCount: number;
  totalCells: number;
}
