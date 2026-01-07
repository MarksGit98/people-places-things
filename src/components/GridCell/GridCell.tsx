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
    if (cellState.status === 'correct') {
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
    if (cellState.status !== 'correct') return '';
    const guessCount = 3 - cellState.guessesRemaining + 1;
    if (guessCount === 1) return 'result--green';
    if (guessCount === 2) return 'result--yellow';
    return 'result--orange';
  };

  return (
    <div
      className={`grid-cell grid-cell--${columnType} ${isFlipped ? 'grid-cell--flipped' : ''} ${showIncorrect ? 'grid-cell--shake' : ''}`}
    >
      <div className="grid-cell__inner">
        {/* Front of card - clue and input */}
        <div className="grid-cell__front">
          <p className="grid-cell__clue">{cell.clue}</p>

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

          {cellState.status === 'incorrect' && (
            <div className="grid-cell__answer grid-cell__answer--incorrect">
              {cell.answer}
            </div>
          )}

          <div className="grid-cell__guesses">
            {Array.from({ length: 3 }).map((_, i) => (
              <span
                key={i}
                className={`grid-cell__guess-dot ${i < cellState.guessesRemaining ? 'grid-cell__guess-dot--active' : ''}`}
              />
            ))}
          </div>
        </div>

        {/* Back of card - correct answer */}
        <div className={`grid-cell__back ${getResultColor()}`}>
          <p className="grid-cell__answer-text">{cell.answer}</p>
          <p className="grid-cell__correct-label">Correct!</p>
        </div>
      </div>
    </div>
  );
}
