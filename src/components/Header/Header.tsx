import './Header.css';

interface HeaderProps {
  puzzleNumber: number;
}

export function Header({ puzzleNumber }: HeaderProps) {
  return (
    <header className="header">
      <h1 className="header__title">People, Places & Things</h1>
      <p className="header__puzzle-number">Puzzle #{puzzleNumber}</p>
      <p className="header__tagline">New Puzzles Every Day!</p>
    </header>
  );
}
