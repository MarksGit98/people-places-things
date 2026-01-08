import { useState, useRef, useEffect } from 'react';
import type { Cell, CellState, ColumnType } from '../../types';
import './GridCell.css';

interface GridCellProps {
  cell: Cell;
  cellState: CellState;
  columnType: ColumnType;
  onGuess: (guess: string) => void;
  disabled?: boolean;
}

export function GridCell({ cell, cellState, columnType, onGuess, disabled }: GridCellProps) {
  const [inputValue, setInputValue] = useState('');
  const [isFlipped, setIsFlipped] = useState(false);
  const [showIncorrect, setShowIncorrect] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const isComplete = cellState.status === 'correct' || cellState.status === 'incorrect';

  useEffect(() => {
    if (cellState.status === 'correct' || cellState.status === 'incorrect') {
      setIsFlipped(true);
    }
  }, [cellState.status]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isComplete || disabled) return;

    const wasCorrect = cellState.status === 'correct';
    onGuess(inputValue.trim());
    setInputValue('');

    // Show shake animation if incorrect
    if (!wasCorrect && cellState.guessesRemaining > 1) {
      setShowIncorrect(true);
      setTimeout(() => setShowIncorrect(false), 500);
    }
  };

  const getResultColor = (): string => {
    if (cellState.status === 'incorrect') return 'result--red';
    if (cellState.status !== 'correct') return '';
    const guessCount = cellState.guesses.length;
    if (guessCount === 1) return 'result--green';
    return 'result--yellow';
  };

  // Show second clue after first wrong guess, or when reviewing completed cell
  const showSecondClue = cellState.guesses.length >= 1;

  // Allow clicking to flip back and view clues on completed cells
  const handleCardClick = () => {
    if (isComplete) {
      setIsFlipped(!isFlipped);
    }
  };

  return (
    <div
      className={`grid-cell grid-cell--${columnType} ${isFlipped ? 'grid-cell--flipped' : ''} ${showIncorrect ? 'grid-cell--shake' : ''} ${isComplete ? 'grid-cell--clickable' : ''}`}
      onClick={handleCardClick}
    >
      <div className="grid-cell__inner">
        {/* Front of card - clue and input */}
        <div className={`grid-cell__front ${isComplete ? `front--${getResultColor()}` : ''}`}>
          {isComplete && (
            <div className="grid-cell__result-icon grid-cell__result-icon--front">
              {cellState.status === 'correct' ? (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              )}
            </div>
          )}

          <div className="grid-cell__clue-section">
            <p className="grid-cell__clue-title">{showSecondClue ? 'Clues' : 'Clue'}</p>
            <div className="grid-cell__clue-divider"></div>
            <div className="grid-cell__clues">
              <p className="grid-cell__clue">1. {cell.clue}</p>
              {showSecondClue && (
                <p className="grid-cell__clue grid-cell__clue--second">2. {cell.clue2}</p>
              )}
            </div>
          </div>

          {!isComplete && (
            <form onSubmit={handleSubmit} className="grid-cell__form">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Your guess..."
                className="grid-cell__input"
                disabled={disabled}
                autoComplete="off"
                autoCapitalize="off"
                autoCorrect="off"
                spellCheck={false}
                enterKeyHint="go"
              />
              <button
                type="submit"
                className="grid-cell__submit"
                disabled={!inputValue.trim() || disabled}
              >
                Go
              </button>
            </form>
          )}

          {!isComplete && (
            <div className="grid-cell__guesses">
              {Array.from({ length: 2 }).map((_, i) => (
                <span
                  key={i}
                  className={`grid-cell__guess-dot ${i < cellState.guessesRemaining ? 'grid-cell__guess-dot--active' : ''}`}
                />
              ))}
            </div>
          )}

          {isComplete && (
            <div className="grid-cell__tap-hint-container">
              <div className="grid-cell__tap-hint-line"></div>
              <p className="grid-cell__tap-hint">Tap to flip back</p>
            </div>
          )}
        </div>

        {/* Back of card - answer reveal */}
        <div className={`grid-cell__back ${getResultColor()}`}>
          <p className="grid-cell__answer-text">{cell.answer}</p>
          <div className="grid-cell__tap-hint-container grid-cell__tap-hint-container--back">
            <div className="grid-cell__tap-hint-line grid-cell__tap-hint-line--back"></div>
            <p className="grid-cell__tap-hint grid-cell__tap-hint--back">Tap to view clues</p>
          </div>
          <div className="grid-cell__result-icon">
            {cellState.status === 'correct' ? (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
