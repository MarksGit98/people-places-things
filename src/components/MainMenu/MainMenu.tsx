import './MainMenu.css';
import { Footer } from '../Footer/Footer';
import { OtherGames } from '../OtherGames/OtherGames';
import { AdsterraBanner } from '../AdsterraBanner/AdsterraBanner';
import { AdsterraAd } from '../AdsterraAd/AdsterraAd';
import bannerImage from '../../assets/Game Banner.png';
import iconImage from '../../assets/Icon.png';

interface MainMenuProps {
  onPlay: () => void;
  puzzleNumber: number;
}

export function MainMenu({ onPlay, puzzleNumber }: MainMenuProps) {
  return (
    <div className="main-menu">
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

      {/* Bottom ad */}
      <div className="main-menu__bottom-ad">
        <AdsterraAd
          scriptSrc="https://pl28527779.effectivegatecpm.com/e367eb54c5443f7ddc13daba8ded0da3/invoke.js"
          containerId="container-e367eb54c5443f7ddc13daba8ded0da3-menu"
        />
      </div>

      <OtherGames />

      <Footer />
    </div>
  );
}
