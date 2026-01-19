import './MainMenu.css';
import bannerImage from '../../assets/Game Banner.png';
import iconImage from '../../assets/Icon.png';

interface MainMenuProps {
  onPlay: () => void;
  puzzleNumber: number;
}

export function MainMenu({ onPlay, puzzleNumber }: MainMenuProps) {
  return (
    <div className="main-menu">
      <div className="main-menu__content">
        <div className="main-menu__header-group">
          <img
            src={bannerImage}
            alt="People, Places, and Things"
            className="main-menu__banner"
          />
          <p className="main-menu__header-tagline">New Puzzles Every Day!</p>
        </div>

        <div className="main-menu__tagline-group">
          <img
            src={iconImage}
            alt=""
            className="main-menu__icon"
          />
          <p className="main-menu__tagline">
            Use the clues provided to fill out the grid
          </p>
        </div>

        <button className="main-menu__play-btn" onClick={onPlay}>
          Play
        </button>

        <span className="main-menu__puzzle-number">Daily Puzzle #{puzzleNumber}</span>

        <span className="main-menu__creator">Created by Mark Bekker</span>
      </div>

      <footer className="app__footer">
        <a href="mailto:rubberduckygamescontact@gmail.com" className="app__contact">
          <svg className="app__contact-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="4" width="20" height="16" rx="2" />
            <path d="M22 7l-10 7L2 7" />
          </svg>
          Contact
        </a>
        <a href="https://digitlgame.com" target="_blank" rel="noopener noreferrer" className="app__other-game">
          <img src="/digitl-favicon.png" alt="Digitl" className="app__other-game-icon" />
          Play my other game
        </a>
      </footer>
    </div>
  );
}
