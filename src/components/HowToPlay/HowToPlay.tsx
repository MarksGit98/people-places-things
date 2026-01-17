import { useState } from 'react';
import './HowToPlay.css';

export function HowToPlay() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <section className={`how-to-play ${isExpanded ? 'how-to-play--expanded' : ''}`}>
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

      <div className={`how-to-play__rules ${isExpanded ? 'how-to-play__rules--visible' : ''}`}>
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
             <p>Note that y-axis constraints can often apply to either first or last names of People. Cell clues may often be playful and tongue-and-cheek as opposed to completely literal.</p>
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
            <p><span className="how-to-play__green">Green</span> = 1st try, <span className="how-to-play__yellow">Yellow</span> = 2nd try, <span className="how-to-play__red">Red</span> = missed</p>
          </div>
        </div>
      </div>
    </section>
  );
}
