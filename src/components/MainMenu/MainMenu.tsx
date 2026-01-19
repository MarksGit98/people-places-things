import './MainMenu.css';
import { Footer } from '../Footer/Footer';
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

      <Footer />
    </div>
  );
}
