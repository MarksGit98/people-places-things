import './Header.css';
import bannerImage from '../../assets/Game Banner.png';

interface HeaderProps {
  onReturnToMenu?: () => void;
}

export function Header({ onReturnToMenu }: HeaderProps) {
  return (
    <header className="header">
      <img
        src={bannerImage}
        alt="People, Places, and Things"
        className={`header__banner-image${onReturnToMenu ? ' header__banner-image--clickable' : ''}`}
        onClick={onReturnToMenu}
      />
      <p className="header__tagline">New Puzzles Every Day!</p>
    </header>
  );
}
