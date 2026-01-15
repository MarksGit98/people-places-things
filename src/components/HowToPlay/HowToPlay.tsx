import './HowToPlay.css';

export function HowToPlay() {
  return (
    <section className="how-to-play">
      <h2 className="how-to-play__title">How to Play</h2>

      <div className="how-to-play__rules">
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
            <p>Each cell also has only one correct answer that must satisify the category, the individual clues provided in the cell, and its respective row constraint.</p>
          </div>
        </div>

        <div className="how-to-play__rule">
          <span className="how-to-play__icon how-to-play__icon--guesses">
            <span className="how-to-play__dot how-to-play__dot--active"></span>
            <span className="how-to-play__dot how-to-play__dot--active"></span>
          </span>
          <div className="how-to-play__text">
            <strong>2 Guesses per Cell</strong>
            <p>You get 2 attempts. After your first wrong guess, a second hint appears to help you.</p>
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
