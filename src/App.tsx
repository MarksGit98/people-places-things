import { useState, useEffect, useRef } from 'react';
import { Header, GameBoard, ResultsModal, HowToPlay, CardOverlay } from './components';
import { useGameState } from './hooks/useGameState';
import puzzleData from './data/puzzles.json';
import type { PuzzleData, Puzzle, ColumnType } from './types';
import './App.css';

// Game URL for sharing - update this when you deploy
const GAME_URL = 'https://people-places-things.vercel.app';

// Dev: get puzzle by index for testing
function getPuzzleByIndex(data: PuzzleData, index: number): Puzzle {
  const puzzleJson = data.puzzles[index];
  return {
    ...puzzleJson,
    id: index + 1,
  };
}

const COLUMN_TYPES: ColumnType[] = ['people', 'places', 'things'];

function App() {
  const [puzzleIndex, setPuzzleIndex] = useState(0);
  const puzzle = getPuzzleByIndex(puzzleData as PuzzleData, puzzleIndex);
  const { gameState, handleGuess, getShareResult } = useGameState(puzzle);
  const [showResults, setShowResults] = useState(false);
  const hasShownResults = useRef(false);
  const totalPuzzles = (puzzleData as PuzzleData).puzzles.length;
  const [overlayCell, setOverlayCell] = useState<{ rowIndex: number; colIndex: number } | null>(null);

  // Show results modal when game is complete
  const isComplete = gameState.gameStatus === 'completed';

  // Auto-show results modal after delay when game completes
  useEffect(() => {
    if (isComplete && !hasShownResults.current) {
      hasShownResults.current = true;
      const timer = setTimeout(() => {
        setShowResults(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [isComplete]);

  const handleReset = () => {
    localStorage.removeItem('ppt-game-state');
    window.location.reload();
  };

  const handleNextPuzzle = () => {
    localStorage.removeItem('ppt-game-state');
    setPuzzleIndex((prev) => (prev + 1) % totalPuzzles);
    hasShownResults.current = false;
    setShowResults(false);
  };

  const handlePrevPuzzle = () => {
    localStorage.removeItem('ppt-game-state');
    setPuzzleIndex((prev) => (prev - 1 + totalPuzzles) % totalPuzzles);
    hasShownResults.current = false;
    setShowResults(false);
  };

  const handleOpenOverlay = (rowIndex: number, colIndex: number) => {
    setOverlayCell({ rowIndex, colIndex });
  };

  const handleCloseOverlay = () => {
    setOverlayCell(null);
  };

  const handleOverlayGuess = (guess: string) => {
    if (overlayCell) {
      handleGuess(overlayCell.rowIndex, overlayCell.colIndex, guess);
    }
  };

  return (
    <div className="app">
      <Header />

      <main className="app__main">
        <p className="app__puzzle-number">Daily Puzzle #{puzzle.id}</p>
        <GameBoard
          puzzle={puzzle}
          gameState={gameState}
          onGuess={handleGuess}
          onOpenOverlay={handleOpenOverlay}
        />

        <HowToPlay />

        {/* Dev buttons - remove for production */}
        <div className="app__dev-buttons">
          <button className="app__reset-btn" onClick={handlePrevPuzzle}>
            Prev Puzzle
          </button>
          <button className="app__reset-btn" onClick={handleReset}>
            Reset Puzzle
          </button>
          <button className="app__reset-btn" onClick={handleNextPuzzle}>
            Next Puzzle
          </button>
        </div>
        <p className="app__dev-info">Puzzle {puzzleIndex + 1} of {totalPuzzles}</p>
      </main>

      <footer className="app__footer">
        <a href="mailto:rubberduckygamescontact@gmail.com" className="app__contact">
          <svg className="app__contact-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="4" width="20" height="16" rx="2" />
            <path d="M22 7l-10 7L2 7" />
          </svg>
          Contact Me
        </a>
      </footer>

      {showResults && (
        <ResultsModal
          result={getShareResult()}
          onClose={() => setShowResults(false)}
          gameUrl={GAME_URL}
        />
      )}

      {/* Mobile card overlay - rendered at root to ensure full-screen blur */}
      {overlayCell && (
        <CardOverlay
          cell={puzzle.rows[overlayCell.rowIndex].cells[overlayCell.colIndex]}
          cellState={gameState.cells[overlayCell.rowIndex][overlayCell.colIndex]}
          columnType={COLUMN_TYPES[overlayCell.colIndex]}
          onGuess={handleOverlayGuess}
          onClose={handleCloseOverlay}
          disabled={isComplete}
        />
      )}
    </div>
  );
}

export default App;
