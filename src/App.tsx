import { useState } from 'react';
import { Header, GameBoard, ResultsModal } from './components';
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

  // Show results modal when game is complete
  const isComplete = gameState.gameStatus === 'completed';

  return (
    <div className="app">
      <Header puzzleNumber={puzzle.id} />

      <main className="app__main">
        <GameBoard
          puzzle={puzzle}
          gameState={gameState}
          onGuess={handleGuess}
        />

        {isComplete && !showResults && (
          <div className="app__complete-banner">
            <p>Puzzle Complete!</p>
            <button
              className="app__view-results"
              onClick={() => setShowResults(true)}
            >
              View Results
            </button>
          </div>
        )}
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
