import { useState } from 'react';
import './HowToPlay.css';

interface HowToPlayProps {
  variant?: 'card' | 'inline' | 'modal';
  onClose?: () => void;
}

export function HowToPlay({ variant = 'card', onClose }: HowToPlayProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const isInline = variant === 'inline';
  const isModal = variant === 'modal';

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && onClose) {
      onClose();
    }
  };

  const content = (
    <section className={`how-to-play ${isExpanded ? 'how-to-play--expanded' : ''} ${isInline ? 'how-to-play--inline' : ''} ${isModal ? 'how-to-play--modal' : ''}`}>
      {isModal && (
        <button className="how-to-play__close" onClick={onClose} aria-label="Close">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      )}

      {isInline || isModal ? (
        <h2 className="how-to-play__title">How to Play</h2>
      ) : (
        <button
          className="how-to-play__header"
          onClick={() => setIsExpanded(!isExpanded)}
          aria-expanded={isExpanded}
        >
          <h2 className="how-to-play__title">How to Play</h2>
          <svg
            className={`how-to-play__chevron ${isExpanded ? 'how-to-play__chevron--up' : ''}`}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>
      )}

      <div className={`how-to-play__rules ${isExpanded || isInline || isModal ? 'how-to-play__rules--visible' : ''}`}>
        <div className="how-to-play__rule">
          <span className="how-to-play__icon how-to-play__icon--grid">
            <span className="how-to-play__mini-grid">
              <span></span><span></span><span></span>
              <span></span><span></span><span></span>
              <span></span><span></span><span></span>
            </span>
          </span>
          <div className="how-to-play__text">
            <strong>3x3 Grid</strong>
            <p>Each puzzle is composed of a 3 x 3 grid. Each column header corresponds to the 3 categories: <span className="how-to-play__people">People</span>, <span className="how-to-play__places">Places</span>, and <span className="how-to-play__things">Things</span> and the answers to the cells in each column fit into their respective category.</p>
          </div>
        </div>

        <div className="how-to-play__rule">
          <span className="how-to-play__icon how-to-play__icon--categories">
            <span className="how-to-play__category-dot how-to-play__category-dot--people"></span>
            <span className="how-to-play__category-dot how-to-play__category-dot--places"></span>
            <span className="how-to-play__category-dot how-to-play__category-dot--things"></span>
          </span>
          <div className="how-to-play__text">
            <strong>Categories</strong>
            <ul className="how-to-play__category-list">
              <li><span className="how-to-play__people">People</span> — Celebrities, historical figures, fictional characters, athletes, musicians, etc</li>
              <li><span className="how-to-play__places">Places</span> — Countries, US States, cities, historical landmarks, famous buildings and landscapes, geographical features, fictional locations, etc</li>
              <li><span className="how-to-play__things">Things</span> — Commonly used objects, specialty tools, food, technology, historical inventions, branded items, fictional items of significance, etc</li>
            </ul>
          </div>
        </div>

        <div className="how-to-play__rule">
          <span className="how-to-play__icon how-to-play__icon--clue">?</span>
          <div className="how-to-play__text">
            <strong>Read the Clues</strong>
            <p>Each cell also has only one correct answer that must satisify the category (along the x-axis), the individual clues provided in each cell, and its respective row constraint (along the y-axis).</p>
             <p>Note that y-axis constraints can apply to either first OR last names of <i>People</i> and not necessarily both. Cell clues may often be playful and tongue-and-cheek as opposed to completely literal.</p>
          </div>
        </div>

        <div className="how-to-play__rule">
          <span className="how-to-play__icon how-to-play__icon--guesses">
            <span className="how-to-play__dot how-to-play__dot--active"></span>
            <span className="how-to-play__dot how-to-play__dot--active"></span>
          </span>
          <div className="how-to-play__text">
            <strong>2 Guesses per Cell</strong>
            <p>You get 2 attempts per cell. After your first wrong guess, a second hint appears to help you.</p>
          </div>
        </div>

        <div className="how-to-play__rule">
          <span className="how-to-play__icon how-to-play__icon--colors">
            <span className="how-to-play__color-box how-to-play__color-box--green"></span>
            <span className="how-to-play__color-box how-to-play__color-box--yellow"></span>
          </span>
          <div className="how-to-play__text">
            <strong>Score</strong>
            <p><span className="how-to-play__green">Green</span>: Correct on 1st try</p>
            <p><span className="how-to-play__yellow">Yellow</span>: Correct on 2nd try</p>
            <p><span className="how-to-play__red">Red</span>: Missed</p>
          </div>
        </div>
      </div>
    </section>
  );

  if (isModal) {
    return (
      <div className="how-to-play__overlay" onClick={handleBackdropClick}>
        {content}
      </div>
    );
  }

  return content;
}
