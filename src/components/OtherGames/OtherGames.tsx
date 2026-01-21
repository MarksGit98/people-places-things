import './OtherGames.css';

export function OtherGames() {
  return (
    <section className="other-games">
      <h2 className="other-games__title">Play My Other Games</h2>
      <div className="other-games__list">
        <a
          href="https://digitlgame.com"
          target="_blank"
          rel="noopener noreferrer"
          className="other-games__item"
        >
          <img
            src="/digitl-favicon.png"
            alt="Digitl"
            className="other-games__icon"
          />
          <span className="other-games__name">Digitl</span>
        </a>
      </div>
    </section>
  );
}
