import type { ShareResult } from '../../types';
import './ResultsModal.css';

interface ResultsModalProps {
  result: ShareResult;
  onClose: () => void;
  gameUrl: string;
}

const EMOJI_MAP = {
  green: '🟩',
  yellow: '🟨',
  orange: '🟧',
  red: '🟥',
};

export function ResultsModal({ result, onClose, gameUrl }: ResultsModalProps) {
  const emojiGrid = result.grid
    .map((row) => row.map((cell) => EMOJI_MAP[cell]).join(''))
    .join('\n');

  const shareText = `People, Places & Things #${result.puzzleNumber}

${emojiGrid}

${result.correctCount}/${result.totalCells} correct — play at ${gameUrl}`;

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          text: shareText,
        });
      } catch (err) {
        // User cancelled or share failed, fall back to clipboard
        copyToClipboard();
      }
    } else {
      copyToClipboard();
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      alert('Copied to clipboard!');
    } catch {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = shareText;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      alert('Copied to clipboard!');
    }
  };

  const getScoreMessage = () => {
    const percentage = (result.correctCount / result.totalCells) * 100;
    if (percentage === 100) return 'Perfect! 🎉';
    if (percentage >= 75) return 'Great job! 🌟';
    if (percentage >= 50) return 'Nice work! 👍';
    if (percentage >= 25) return 'Good effort! 💪';
    return 'Better luck next time! 🍀';
  };

  return (
    <div className="results-modal-overlay" onClick={onClose}>
      <div className="results-modal" onClick={(e) => e.stopPropagation()}>
        <button className="results-modal__close" onClick={onClose}>
          ×
        </button>

        <h2 className="results-modal__title">Puzzle Complete!</h2>
        <p className="results-modal__message">{getScoreMessage()}</p>

        <div className="results-modal__score">
          <span className="results-modal__score-number">{result.correctCount}</span>
          <span className="results-modal__score-divider">/</span>
          <span className="results-modal__score-total">{result.totalCells}</span>
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
          Share Result
        </button>

        <div className="results-modal__preview">
          <p className="results-modal__preview-label">Preview:</p>
          <pre className="results-modal__preview-text">{shareText}</pre>
        </div>
      </div>
    </div>
  );
}
