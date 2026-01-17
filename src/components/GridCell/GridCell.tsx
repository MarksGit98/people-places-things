import { useState, useRef, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { Cell, CellState, ColumnType } from '../../types';
import './GridCell.css';

/** Threshold for considering a word "long" (requires smaller font) */
const LONG_WORD_THRESHOLD = 12;

/**
 * Checks if the answer contains a continuous word (no spaces) that is 12+ characters
 */
function hasLongWord(answer: string): boolean {
  const words = answer.split(/\s+/);
  return words.some(word => word.length >= LONG_WORD_THRESHOLD);
}

/**
 * Parses text containing <i> tags and returns React elements with italic styling
 */
function parseClueText(text: string): ReactNode {
  const parts: ReactNode[] = [];
  const regex = /<i>(.*?)<\/i>/gi;
  let lastIndex = 0;
  let match;
  let key = 0;

  while ((match = regex.exec(text)) !== null) {
    // Add text before the match
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    // Add the italic text
    parts.push(<i key={key++}>{match[1]}</i>);
    lastIndex = regex.lastIndex;
  }

  // Add remaining text after last match
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts.length > 0 ? parts : text;
}

interface GridCellProps {
  cell: Cell;
  cellState: CellState;
  columnType: ColumnType;
  onGuess: (guess: string) => void;
  onOpenOverlay?: () => void;
  disabled?: boolean;
}

export function GridCell({ cell, cellState, columnType, onGuess, onOpenOverlay, disabled }: GridCellProps) {
  const [inputValue, setInputValue] = useState('');
  const [isFlipped, setIsFlipped] = useState(false);
  const [showIncorrect, setShowIncorrect] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 600);
  const inputRef = useRef<HTMLInputElement>(null);
  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isLongPress = useRef(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 600);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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

  // On mobile: single tap opens overlay, long press flips card
  // On desktop: single click flips card
  const handleCardClick = () => {
    // Don't handle click if this was a long press
    if (isLongPress.current) {
      isLongPress.current = false;
      return;
    }

    if (isMobile && onOpenOverlay) {
      // On mobile, single tap opens the overlay
      onOpenOverlay();
    } else if (isComplete) {
      // On desktop, or if no overlay handler, flip the card
      setIsFlipped(!isFlipped);
    }
  };

  // Long press handler for mobile - alternative way to flip card
  const handleTouchStart = () => {
    if (!isComplete || !isMobile) return;

    isLongPress.current = false;
    longPressTimer.current = setTimeout(() => {
      isLongPress.current = true;
      setIsFlipped(!isFlipped);
    }, 500);
  };

  const handleTouchEnd = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  };

  return (
    <div
      className={`grid-cell grid-cell--${columnType} ${isFlipped ? 'grid-cell--flipped' : ''} ${showIncorrect ? 'grid-cell--shake' : ''} ${isComplete || isMobile ? 'grid-cell--clickable' : ''}`}
      onClick={handleCardClick}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
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
            <p className="grid-cell__clue-title">Clues</p>
            <div className="grid-cell__clue-divider"></div>
            <div className="grid-cell__clues">
              <p className="grid-cell__clue">1. {parseClueText(cell.clue)}</p>
              {showSecondClue ? (
                <p className="grid-cell__clue grid-cell__clue--second">2. {parseClueText(cell.clue2)}</p>
              ) : (
                <p className="grid-cell__clue grid-cell__clue--placeholder">2. Guess to reveal second clue</p>
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
                placeholder={isMobile ? "Guess..." : "Guess here..."}
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

          {!isComplete && !isMobile && (
            <div className="grid-cell__guesses">
              {Array.from({ length: 2 }).map((_, i) => (
                <span
                  key={i}
                  className={`grid-cell__guess-dot ${i < cellState.guessesRemaining ? 'grid-cell__guess-dot--active' : ''}`}
                />
              ))}
            </div>
          )}

          {/* Mobile tap hint for incomplete cells */}
          {!isComplete && isMobile && (
            <div className="grid-cell__tap-hint-container">
              <div className="grid-cell__tap-hint-line"></div>
              <p className="grid-cell__tap-hint">Tap to answer</p>
            </div>
          )}

          {isComplete && (
            <div className="grid-cell__tap-hint-container">
              <div className="grid-cell__tap-hint-line"></div>
              <p className="grid-cell__tap-hint">{isMobile ? 'Hold to flip' : 'Tap to flip back'}</p>
            </div>
          )}
        </div>

        {/* Back of card - answer reveal */}
        <div className={`grid-cell__back ${getResultColor()}`}>
          {/* Result indicator centered above answer */}
          <div className="grid-cell__result-indicator">
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
          <p className={`grid-cell__answer-text ${hasLongWord(cell.answer) ? 'grid-cell__answer-text--long' : ''}`}>{cell.answer}</p>
          <div className="grid-cell__tap-hint-container grid-cell__tap-hint-container--back">
            <div className="grid-cell__tap-hint-line grid-cell__tap-hint-line--back"></div>
            <p className="grid-cell__tap-hint grid-cell__tap-hint--back">{isMobile ? 'Hold to flip' : 'Tap to view clues'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
