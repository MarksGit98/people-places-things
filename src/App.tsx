import { useState, useEffect, useRef } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import { Header, GameBoard, ResultsModal, HowToPlay, CardOverlay, AdsterraAd, MainMenu, Footer, PrivacyPolicy, About, FAQ } from './components';
import { useGameState } from './hooks/useGameState';
import puzzleData from './data/puzzles.json';
import type { PuzzleData, Puzzle, ColumnType } from './types';
import './App.css';

// Game URL for sharing
const GAME_URL = 'https://peopleplacesandthings.io';

// Reference date for daily puzzle rotation (January 14, 2026 = Puzzle 1)
const PUZZLE_START_YEAR = 2026;
const PUZZLE_START_MONTH = 1;
const PUZZLE_START_DAY = 14;
const MS_PER_DAY = 24 * 60 * 60 * 1000;

/**
 * Gets the daily puzzle index based on current date in EST timezone
 * Cycles back to first puzzle when all puzzles have been shown
 */
function getDailyPuzzleIndex(totalPuzzles: number): number {
  const now = new Date();

  // Get current date in EST timezone (YYYY-MM-DD format)
  const estDateStr = now.toLocaleDateString('en-CA', { timeZone: 'America/New_York' });
  const [year, month, day] = estDateStr.split('-').map(Number);

  // Calculate days since reference date
  const estDate = new Date(year, month - 1, day);
  const refDate = new Date(PUZZLE_START_YEAR, PUZZLE_START_MONTH - 1, PUZZLE_START_DAY);
  const daysSinceStart = Math.floor((estDate.getTime() - refDate.getTime()) / MS_PER_DAY);

  // Cycle through puzzles (handle negative values for dates before start)
  return ((daysSinceStart % totalPuzzles) + totalPuzzles) % totalPuzzles;
}

// Get puzzle by index
function getPuzzleByIndex(data: PuzzleData, index: number): Puzzle {
  const puzzleJson = data.puzzles[index];
  return {
    ...puzzleJson,
    id: index + 1,
  };
}

const COLUMN_TYPES: ColumnType[] = ['people', 'places', 'things'];

// Landscape blocker component
function LandscapeBlocker() {
  return (
    <div className="app__landscape-blocker">
      <svg className="app__landscape-blocker-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="2" width="16" height="20" rx="2" ry="2" />
        <line x1="12" y1="18" x2="12" y2="18" />
      </svg>
      <p className="app__landscape-blocker-text">Please rotate your device</p>
      <p className="app__landscape-blocker-subtext">This game is best played in portrait mode</p>
    </div>
  );
}

function GamePage() {
  const totalPuzzles = (puzzleData as PuzzleData).puzzles.length;
  const dailyPuzzleIndex = getDailyPuzzleIndex(totalPuzzles);
  const [puzzleIndex] = useState(dailyPuzzleIndex);
  const puzzle = getPuzzleByIndex(puzzleData as PuzzleData, puzzleIndex);
  const { gameState, handleGuess, getShareResult } = useGameState(puzzle);
  const [showResults, setShowResults] = useState(false);
  const hasShownResults = useRef(false);
  const [overlayCell, setOverlayCell] = useState<{ rowIndex: number; colIndex: number } | null>(null);
  const [showMainMenu, setShowMainMenu] = useState(true);
  const [showHowToPlayModal, setShowHowToPlayModal] = useState(false);

  // Show results modal when game is complete
  const isComplete = gameState.gameStatus === 'completed';

  // Auto-show results modal after delay when game completes
  useEffect(() => {
    if (isComplete && !hasShownResults.current) {
      hasShownResults.current = true;
      const timer = setTimeout(() => {
        setOverlayCell(null); // Close any open card overlay before showing results
        setShowResults(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [isComplete]);

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

  const handlePlay = () => {
    setShowMainMenu(false);
    setShowHowToPlayModal(true);
  };

  if (showMainMenu) {
    return (
      <div className="app">
        <LandscapeBlocker />
        <MainMenu
          onPlay={handlePlay}
          puzzleNumber={puzzle.id}
        />
      </div>
    );
  }

  return (
    <div className="app">
      <LandscapeBlocker />
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

        {/* Ad below How to Play */}
        <div className="app__ad-below-game">
          <AdsterraAd
            scriptSrc="https://pl28527779.effectivegatecpm.com/e367eb54c5443f7ddc13daba8ded0da3/invoke.js"
            containerId="container-e367eb54c5443f7ddc13daba8ded0da3"
          />
        </div>

      </main>

      <Footer />

      {showResults && (
        <ResultsModal
          result={getShareResult()}
          onClose={() => setShowResults(false)}
          gameUrl={GAME_URL}
        />
      )}

      {showHowToPlayModal && (
        <HowToPlay
          variant="modal"
          onClose={() => setShowHowToPlayModal(false)}
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

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<GamePage />} />
        <Route path="/about" element={<About />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
      </Routes>
      <Analytics />
    </BrowserRouter>
  );
}

export default App;
