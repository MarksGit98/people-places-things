import { useState, useRef, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { Cell, CellState, ColumnType } from '../../types';
import './CardOverlay.css';

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
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    parts.push(<i key={key++}>{match[1]}</i>);
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts.length > 0 ? parts : text;
}

interface CardOverlayProps {
  cell: Cell;
  cellState: CellState;
  columnType: ColumnType;
  onGuess: (guess: string) => void;
  onClose: () => void;
  disabled?: boolean;
}

export function CardOverlay({ cell, cellState, columnType, onGuess, onClose, disabled }: CardOverlayProps) {
  const [inputValue, setInputValue] = useState('');
  const [isInputFocused, setIsInputFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  const isComplete = cellState.status === 'correct' || cellState.status === 'incorrect';

  // Initialize flipped state - start flipped if already complete (no animation)
  const [isFlipped, setIsFlipped] = useState(isComplete);

  // Focus input when overlay opens (if not complete)
  useEffect(() => {
    if (!isComplete && inputRef.current) {
      // Small delay to ensure overlay animation completes
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isComplete]);

  // Prevent body scroll and handle keyboard on mobile
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) {
      onClose();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isComplete || disabled) return;
    onGuess(inputValue.trim());
    setInputValue('');
  };

  const getResultColor = (): string => {
    if (cellState.status === 'incorrect') return 'result--red';
    if (cellState.status !== 'correct') return '';
    const guessCount = cellState.guesses.length;
    if (guessCount === 1) return 'result--green';
    return 'result--yellow';
  };

  const showSecondClue = cellState.guesses.length >= 1;

  // Long press to flip card (alternative to tap)
  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [isLongPressing, setIsLongPressing] = useState(false);

  const handleTouchStart = () => {
    if (!isComplete) return;
    longPressTimer.current = setTimeout(() => {
      setIsLongPressing(true);
      setIsFlipped(!isFlipped);
    }, 500);
  };

  const handleTouchEnd = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
    setIsLongPressing(false);
  };

  const handleCardClick = () => {
    if (isComplete && !isLongPressing) {
      setIsFlipped(!isFlipped);
    }
  };

  return (
    <div
      className="card-overlay"
      ref={overlayRef}
      onClick={handleOverlayClick}
    >
      <div className={`card-overlay__card card-overlay__card--${columnType} ${isFlipped ? 'card-overlay__card--flipped' : ''} ${isInputFocused ? 'card-overlay__card--keyboard-open' : ''}`}>
        {/* Flip container */}
        <div
          className={`card-overlay__inner ${isFlipped ? 'card-overlay__inner--flipped' : ''}`}
          onClick={handleCardClick}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onTouchCancel={handleTouchEnd}
        >
          {/* Front of card */}
          <div className={`card-overlay__front ${isComplete ? `front--${getResultColor()}` : ''}`}>
            {/* Close button - front */}
            <button
              className="card-overlay__close"
              onClick={(e) => { e.stopPropagation(); onClose(); }}
              aria-label="Close"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
            {isComplete && (
              <div className={`card-overlay__result-indicator card-overlay__result-indicator--front ${getResultColor()}`}>
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

            <div className="card-overlay__clue-section">
              <p className="card-overlay__clue-title">Clues</p>
              <div className="card-overlay__clue-divider"></div>
              <div className="card-overlay__clues">
                <p className="card-overlay__clue">1. {parseClueText(cell.clue)}</p>
                {showSecondClue ? (
                  <p className="card-overlay__clue card-overlay__clue--second">2. {parseClueText(cell.clue2)}</p>
                ) : (
                  <p className="card-overlay__clue card-overlay__clue--placeholder">2. Guess to reveal second clue</p>
                )}
              </div>
            </div>

            {!isComplete && (
              <>
                <form onSubmit={handleSubmit} className="card-overlay__form">
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onFocus={() => setIsInputFocused(true)}
                    onBlur={() => setIsInputFocused(false)}
                    placeholder="Guess here..."
                    className="card-overlay__input"
                    disabled={disabled}
                    autoComplete="off"
                    autoCapitalize="off"
                    autoCorrect="off"
                    spellCheck={false}
                    enterKeyHint="go"
                  />
                  <button
                    type="submit"
                    className="card-overlay__submit"
                    disabled={!inputValue.trim() || disabled}
                  >
                    Go
                  </button>
                </form>

                <div className="card-overlay__guesses">
                  {Array.from({ length: 2 }).map((_, i) => (
                    <span
                      key={i}
                      className={`card-overlay__guess-dot ${i < cellState.guessesRemaining ? 'card-overlay__guess-dot--active' : ''}`}
                    />
                  ))}
                </div>
              </>
            )}

            {isComplete && (
              <div className="card-overlay__tap-hint">
                <p>Tap card to see answer</p>
              </div>
            )}
          </div>

          {/* Back of card - answer reveal */}
          <div className={`card-overlay__back ${getResultColor()}`}>
            {/* Close button - back */}
            <button
              className="card-overlay__close card-overlay__close--back"
              onClick={(e) => { e.stopPropagation(); onClose(); }}
              aria-label="Close"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            {/* Result indicator centered above answer */}
            <div className={`card-overlay__result-indicator card-overlay__result-indicator--back ${getResultColor()}`}>
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

            <p className="card-overlay__answer-text">{cell.answer}</p>

            <div className="card-overlay__tap-hint card-overlay__tap-hint--back">
              <p>Tap to view clues</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
