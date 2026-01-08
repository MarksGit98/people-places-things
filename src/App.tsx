import { useState, useEffect, useRef } from 'react';
import { Header, GameBoard, ResultsModal, HowToPlay } from './components';
import { useGameState } from './hooks/useGameState';
import { getDailyPuzzle } from './utils/getDailyPuzzle';
import puzzleData from './data/puzzles.json';
import type { PuzzleData } from './types';
import './App.css';

// Game URL for sharing - update this when you deploy
const GAME_URL = 'https://people-places-things.vercel.app';

function App() {
  const puzzle = getDailyPuzzle(puzzleData as PuzzleData);
  const { gameState, handleGuess, getShareResult } = useGameState(puzzle);
  const [showResults, setShowResults] = useState(false);
  const hasShownResults = useRef(false);

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

  return (
    <div className="app">
      <Header />

      <main className="app__main">
        <p className="app__puzzle-number">Daily Puzzle #{puzzle.id}</p>
        <GameBoard
          puzzle={puzzle}
          gameState={gameState}
          onGuess={handleGuess}
        />

        <HowToPlay />

        {/* Dev reset button - remove for production */}
        <button className="app__reset-btn" onClick={handleReset}>
          Reset Puzzle
        </button>
      </main>

      {showResults && (
        <ResultsModal
          result={getShareResult()}
          onClose={() => setShowResults(false)}
          gameUrl={GAME_URL}
        />
      )}
    </div>
  );
}

export default App;
