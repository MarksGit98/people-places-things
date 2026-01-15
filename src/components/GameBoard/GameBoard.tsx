import { useState, useEffect } from 'react';
import type { Puzzle, GameState, ColumnType } from '../../types';
import { GridCell } from '../GridCell/GridCell';
import { CardOverlay } from '../CardOverlay/CardOverlay';
import './GameBoard.css';

interface GameBoardProps {
  puzzle: Puzzle;
  gameState: GameState;
  onGuess: (rowIndex: number, colIndex: number, guess: string) => void;
}

const COLUMN_HEADERS: { label: string; type: ColumnType }[] = [
  { label: 'People', type: 'people' },
  { label: 'Places', type: 'places' },
  { label: 'Things', type: 'things' },
];

export function GameBoard({ puzzle, gameState, onGuess }: GameBoardProps) {
  const isGameComplete = gameState.gameStatus === 'completed';
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 600);
  const [overlayCell, setOverlayCell] = useState<{ rowIndex: number; colIndex: number } | null>(null);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 600);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleOpenOverlay = (rowIndex: number, colIndex: number) => {
    if (isMobile) {
      setOverlayCell({ rowIndex, colIndex });
    }
  };

  const handleCloseOverlay = () => {
    setOverlayCell(null);
  };

  const handleOverlayGuess = (guess: string) => {
    if (overlayCell) {
      onGuess(overlayCell.rowIndex, overlayCell.colIndex, guess);
    }
  };

  return (
    <div className="game-board">
      {/* Column headers */}
      <div className="game-board__header">
        <div className="game-board__corner" />
        {COLUMN_HEADERS.map((col) => (
          <div key={col.type} className={`game-board__column-header game-board__column-header--${col.type}`}>
            {col.label}
          </div>
        ))}
      </div>

      {/* Grid rows */}
      {puzzle.rows.map((row, rowIndex) => (
        <div key={rowIndex} className="game-board__row">
          {/* Row constraint label */}
          <div className="game-board__row-label">
            <span className="game-board__constraint">{row.constraint}</span>
          </div>

          {/* Cells */}
          {row.cells.map((cell, colIndex) => (
            <GridCell
              key={`${rowIndex}-${colIndex}`}
              cell={cell}
              cellState={gameState.cells[rowIndex][colIndex]}
              columnType={COLUMN_HEADERS[colIndex].type}
              onGuess={(guess) => onGuess(rowIndex, colIndex, guess)}
              onOpenOverlay={() => handleOpenOverlay(rowIndex, colIndex)}
              disabled={isGameComplete}
            />
          ))}
        </div>
      ))}

      {/* Mobile card overlay */}
      {overlayCell && isMobile && (
        <CardOverlay
          cell={puzzle.rows[overlayCell.rowIndex].cells[overlayCell.colIndex]}
          cellState={gameState.cells[overlayCell.rowIndex][overlayCell.colIndex]}
          columnType={COLUMN_HEADERS[overlayCell.colIndex].type}
          onGuess={handleOverlayGuess}
          onClose={handleCloseOverlay}
          disabled={isGameComplete}
        />
      )}
    </div>
  );
}
