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
            <p>Each puzzle has 9 cells across 3 categories: <span className="how-to-play__people">People</span>, <span className="how-to-play__places">Places</span>, and <span className="how-to-play__things">Things</span>.</p>
          </div>
        </div>

        <div className="how-to-play__rule">
          <span className="how-to-play__icon how-to-play__icon--clue">?</span>
          <div className="how-to-play__text">
            <strong>Read the Clues</strong>
            <p>Each cell has a clue and a row constraint. Your answer must satisfy both!</p>
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
            <strong>Score by Speed</strong>
            <p><span className="how-to-play__green">Green</span> = 1st try, <span className="how-to-play__yellow">Yellow</span> = 2nd try, <span className="how-to-play__red">Red</span> = missed</p>
          </div>
        </div>
      </div>
    </section>
  );
}
