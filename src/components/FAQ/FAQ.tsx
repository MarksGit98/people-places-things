import { Link } from 'react-router-dom';
import { AdsterraAd } from '../AdsterraAd/AdsterraAd';
import { AdsterraBanner } from '../AdsterraBanner/AdsterraBanner';
import './FAQ.css';

export function FAQ() {
  return (
    <div className="faq">
      {/* Left side ad - desktop only */}
      <AdsterraBanner
        adKey="331f88141ea45a2aa275c9a5c10f0c27"
        width={160}
        height={300}
        position="left"
        desktopOnly
      />

      {/* Right side ad - desktop only */}
      <AdsterraBanner
        adKey="7370110dc9e2b65e305339fd5395c7e3"
        width={300}
        height={250}
        position="right"
        desktopOnly
      />

      <div className="faq__container">
        <Link to="/" className="faq__home">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
        </Link>

        <h1 className="faq__title">FAQ</h1>

        <div className="faq__list">
          <div className="faq__item">
            <h2 className="faq__question">How do I play?</h2>
            <p className="faq__answer">
              Each puzzle is a 3x3 grid. Columns are categories (People, Places, Things) and rows have
              linguistic constraints (like "Starts with M"). Use the clues to find the answer that fits
              both the category and the constraint. You get two guesses per cell.
            </p>
          </div>

          <div className="faq__item">
            <h2 className="faq__question">When do new puzzles come out?</h2>
            <p className="faq__answer">
              A new puzzle is released every day at midnight Eastern Time (EST/EDT). Come back tomorrow
              for a fresh challenge.
            </p>
          </div>

          <div className="faq__item">
            <h2 className="faq__question">What do the colors mean?</h2>
            <p className="faq__answer">
              <strong>Green</strong> means you got it on your first guess. <strong>Yellow</strong> means
              you needed the second guess. <strong>Red</strong> means you missed both guesses or skipped
              the cell.
            </p>
          </div>

          <div className="faq__item">
            <h2 className="faq__question">How do the clues work?</h2>
            <p className="faq__answer">
              Each cell has two clues. The first clue is intentionally trickier—it might be indirect,
              punny, or require some lateral thinking. If you're stuck, tap the hint button to reveal
              the second clue, which is more straightforward.
            </p>
          </div>

          <div className="faq__item">
            <h2 className="faq__question">What counts as a "Person"?</h2>
            <p className="faq__answer">
              Real people (celebrities, athletes, historical figures, politicians) and fictional
              characters (from movies, books, TV, etc.). For fictional characters, the clue will
              usually hint that they're not real.
            </p>
          </div>

          <div className="faq__item">
            <h2 className="faq__question">What counts as a "Place"?</h2>
            <p className="faq__answer">
              Cities, countries, states, continents, landmarks, mountains, bodies of water, and
              fictional locations like Hogwarts or Gotham City. Fictional places will have a hint
              in the clue.
            </p>
          </div>

          <div className="faq__item">
            <h2 className="faq__question">What counts as a "Thing"?</h2>
            <p className="faq__answer">
              Objects, inventions, tools, food items, branded products, and fictional items like
              a lightsaber or the One Ring. We aim for interesting and specific things rather than
              generic household items.
            </p>
          </div>

          <div className="faq__item">
            <h2 className="faq__question">My answer was close but marked wrong. Why?</h2>
            <p className="faq__answer">
              The game uses fuzzy matching and accepts common variations, but it needs to be reasonably
              close to the expected answer. Check your spelling, and remember that some answers might
              be more specific than you'd expect (e.g., "Michael Jordan" vs. just "Jordan").
            </p>
          </div>

          <div className="faq__item">
            <h2 className="faq__question">Can I play old puzzles?</h2>
            <p className="faq__answer">
              Currently, only the daily puzzle is available. We're considering adding an archive
              feature in the future.
            </p>
          </div>

          <div className="faq__item">
            <h2 className="faq__question">How do I share my results?</h2>
            <p className="faq__answer">
              After completing the puzzle, a results screen will appear with a "Copy Results" button.
              This copies an emoji grid representing your performance that you can paste anywhere.
            </p>
          </div>

          <div className="faq__item">
            <h2 className="faq__question">I found an error in a puzzle. How do I report it?</h2>
            <p className="faq__answer">
              Please email us at{' '}
              <a href="mailto:rubberduckygamescontact@gmail.com">rubberduckygamescontact@gmail.com</a>{' '}
              with the puzzle number and details about the issue. We appreciate the help.
            </p>
          </div>
        </div>

        {/* Bottom ad */}
        <div className="faq__bottom-ad">
          <AdsterraAd
            scriptSrc="https://pl28527779.effectivegatecpm.com/e367eb54c5443f7ddc13daba8ded0da3/invoke.js"
            containerId="container-e367eb54c5443f7ddc13daba8ded0da3-faq"
          />
        </div>
      </div>

      {/* Banner ad at very bottom */}
      <div className="faq__banner-ad">
        <AdsterraBanner
          adKey="7370110dc9e2b65e305339fd5395c7e3"
          width={300}
          height={250}
          position="bottom"
        />
      </div>
    </div>
  );
}
