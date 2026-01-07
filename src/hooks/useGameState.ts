import { useState, useEffect, useCallback } from 'react';
import type { Puzzle, GameState, CellState, ShareResult } from '../types';
import { isCorrectAnswer } from '../utils/fuzzyMatch';

const STORAGE_KEY = 'ppt-game-state';

function createInitialCellState(): CellState {
  return {
    guesses: [],
    status: 'unanswered',
    guessesRemaining: 3,
  };
}

function createInitialGameState(puzzleId: number): GameState {
  return {
    puzzleId,
    cells: [
      [createInitialCellState(), createInitialCellState(), createInitialCellState()],
      [createInitialCellState(), createInitialCellState(), createInitialCellState()],
      [createInitialCellState(), createInitialCellState(), createInitialCellState()],
    ],
    gameStatus: 'playing',
    startedAt: new Date().toISOString(),
  };
}

function loadGameState(puzzleId: number): GameState {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed: GameState = JSON.parse(stored);
      // Only use stored state if it's for the current puzzle
      if (parsed.puzzleId === puzzleId) {
        return parsed;
      }
    }
  } catch (error) {
    console.error('Failed to load game state:', error);
  }
  return createInitialGameState(puzzleId);
}

function saveGameState(state: GameState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error('Failed to save game state:', error);
  }
}

export function useGameState(puzzle: Puzzle) {
  const [gameState, setGameState] = useState<GameState>(() =>
    loadGameState(puzzle.id)
  );

  // Save to localStorage whenever state changes
  useEffect(() => {
    saveGameState(gameState);
  }, [gameState]);

  // Check if game is complete
  const checkGameComplete = useCallback((cells: CellState[][]): boolean => {
    return cells.every((row) =>
      row.every((cell) => cell.status === 'correct' || cell.status === 'incorrect')
    );
  }, []);

  const handleGuess = useCallback(
    (rowIndex: number, colIndex: number, guess: string) => {
      const cell = puzzle.rows[rowIndex].cells[colIndex];
      const correct = isCorrectAnswer(guess, cell.answer);

      setGameState((prev) => {
        const newCells = prev.cells.map((row, rIdx) =>
          row.map((cellState, cIdx) => {
            if (rIdx !== rowIndex || cIdx !== colIndex) {
              return cellState;
            }

            const newGuesses = [...cellState.guesses, guess];
            const newGuessesRemaining = cellState.guessesRemaining - 1;

            let newStatus = cellState.status;
            if (correct) {
              newStatus = 'correct';
            } else if (newGuessesRemaining === 0) {
              newStatus = 'incorrect';
            }

            return {
              guesses: newGuesses,
              guessesRemaining: newGuessesRemaining,
              status: newStatus,
            };
          })
        );

        const isComplete = checkGameComplete(newCells);

        return {
          ...prev,
          cells: newCells,
          gameStatus: isComplete ? 'completed' : 'playing',
          completedAt: isComplete ? new Date().toISOString() : undefined,
        };
      });
    },
    [puzzle, checkGameComplete]
  );

  const getShareResult = useCallback((): ShareResult => {
    const grid = gameState.cells.map((row) =>
      row.map((cell): 'green' | 'yellow' | 'orange' | 'red' => {
        if (cell.status !== 'correct') return 'red';
        const guessCount = cell.guesses.length;
        if (guessCount === 1) return 'green';
        if (guessCount === 2) return 'yellow';
        return 'orange';
      })
    );

    const correctCount = gameState.cells.flat().filter((c) => c.status === 'correct').length;

    return {
      puzzleNumber: puzzle.id,
      grid,
      correctCount,
      totalCells: 9,
    };
  }, [gameState.cells, puzzle.id]);

  return {
    gameState,
    handleGuess,
    getShareResult,
  };
}
