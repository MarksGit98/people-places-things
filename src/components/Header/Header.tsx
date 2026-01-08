import './Header.css';

export function Header() {
  return (
    <header className="header">
      <h1 className="header__title">
        <span className="header__title-line">
          <span className="header__word header__word--people">People</span>
          <span className="header__separator header__separator--comma">,</span>
          <span className="header__word header__word--places">Places</span>
        </span>
        <span className="header__title-line">
          <span className="header__separator">& </span>
          <span className="header__word header__word--things">Things</span>
        </span>
      </h1>
      <p className="header__tagline">New Puzzles Every Day!</p>
    </header>
  );
}
