import { useState } from 'react';
import type { ShareResult } from '../../types';
import bannerImage from '../../assets/Game Banner.png';
import './ResultsModal.css';

interface ResultsModalProps {
  result: ShareResult;
  onClose: () => void;
  gameUrl: string;
}

const EMOJI_MAP: Record<string, string> = {
  green: '🟩',
  yellow: '🟨',
  orange: '🟧',
  red: '🟥',
};

export function ResultsModal({ result, onClose, gameUrl }: ResultsModalProps) {
  const [copied, setCopied] = useState(false);

  const emojiGrid = result.grid
    .map((row) => row.map((cell) => EMOJI_MAP[cell]).join(''))
    .join('\n');

  const shareText = `People, Places & Things Daily Puzzle #${result.puzzleNumber} 🧩
${result.correctCount}/${result.totalCells} Correct 🎯

${emojiGrid}

${gameUrl}`;

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = shareText;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="results-modal-overlay" onClick={onClose}>
      <div className="results-modal" onClick={(e) => e.stopPropagation()}>
        <button className="results-modal__close" onClick={onClose} aria-label="Close">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <img
          src={bannerImage}
          alt="People, Places, and Things"
          className="results-modal__banner"
        />

        <div className="results-modal__score">
          <span className="results-modal__score-number">{result.correctCount}</span>
          <span className="results-modal__score-divider">/</span>
          <span className="results-modal__score-total">{result.totalCells}</span>
          <span className="results-modal__score-label">Correct!</span>
        </div>

        <div className="results-modal__grid">
          {result.grid.map((row, rowIndex) => (
            <div key={rowIndex} className="results-modal__grid-row">
              {row.map((cell, colIndex) => (
                <span key={colIndex} className="results-modal__emoji">
                  {EMOJI_MAP[cell]}
                </span>
              ))}
            </div>
          ))}
        </div>

        <button className="results-modal__share" onClick={handleShare}>
          {copied ? 'Copied!' : 'Share Results'}
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 2L11 13" />
            <path d="M22 2L15 22L11 13L2 9L22 2Z" />
          </svg>
        </button>
      </div>
    </div>
  );
}
