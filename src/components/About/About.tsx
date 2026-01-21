import { Link } from 'react-router-dom';
import { AdsterraAd } from '../AdsterraAd/AdsterraAd';
import './About.css';

export function About() {
  return (
    <div className="about">
      <div className="about__container">
        <Link to="/" className="about__home">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
        </Link>

        <h1 className="about__title">About</h1>

        <section className="about__section">
          <h2>The Game</h2>
          <p>
            <strong>People, Places & Things</strong> is a daily word puzzle that challenges you to fill a 3x3 grid
            using clues and constraints. Each column represents a category—People, Places, or Things—while each
            row has a linguistic constraint like "Starts with M" or "Contains an animal."
          </p>
          <p>
            Your job is to find the answer that satisfies both the column category and the row constraint,
            using the two clues provided for each cell. The first clue is trickier; the second is more direct.
            You get two guesses per cell—make them count.
          </p>
        </section>

        <section className="about__section">
          <h2>How It Works</h2>
          <ul>
            <li><strong>New puzzle every day</strong> — A fresh challenge drops at midnight EST</li>
            <li><strong>Two clues per cell</strong> — Start with the harder clue, reveal the easier one if needed</li>
            <li><strong>Two guesses per cell</strong> — Green on the first try, yellow on the second, red if you miss</li>
            <li><strong>Share your results</strong> — Compare scores with friends using the emoji grid</li>
          </ul>
        </section>

        <section className="about__section">
          <h2>The Creator</h2>
          <p>
            People, Places & Things was created by <strong>Mark Bekker</strong>, a puzzle enthusiast who wanted
            to build something that combines the satisfaction of crossword clues with the daily ritual of games
            like Wordle.
          </p>
          <p>
            The goal was simple: make a puzzle that's quick to play but tricky enough to make you think.
            Something you can do with your morning coffee or during a break.
          </p>
        </section>

        <section className="about__section">
          <h2>Get in Touch</h2>
          <p>
            Have feedback, found a bug, or just want to say hi? Reach out at{' '}
            <a href="mailto:rubberduckygamescontact@gmail.com">rubberduckygamescontact@gmail.com</a>
          </p>
        </section>

        {/* Bottom ad */}
        <div className="about__bottom-ad">
          <AdsterraAd
            scriptSrc="https://pl28527779.effectivegatecpm.com/e367eb54c5443f7ddc13daba8ded0da3/invoke.js"
            containerId="container-e367eb54c5443f7ddc13daba8ded0da3-about"
          />
        </div>
      </div>
    </div>
  );
}
