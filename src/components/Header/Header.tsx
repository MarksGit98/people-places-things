import './Header.css';
import bannerImage from '../../assets/Game Banner.png';

export function Header() {
  return (
    <header className="header">
      <img
        src={bannerImage}
        alt="People, Places, and Things"
        className="header__banner-image"
      />
      <p className="header__tagline">New Puzzles Every Day!</p>
    </header>
  );
}
