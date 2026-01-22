import './OtherGames.css';

interface GameInfo {
  name: string;
  tagline: string;
  url: string;
  icon: string;
}

const games: GameInfo[] = [
  {
    name: 'Digitl',
    tagline: 'Daily Number Puzzle',
    url: 'https://digitlgame.com',
    icon: '/digitl-favicon.png',
  },
];

export function OtherGames() {
  return (
    <section className="other-games">
      <h2 className="other-games__title">Other Games</h2>
      <div className="other-games__list">
        {games.map((game) => (
          <a
            key={game.name}
            href={game.url}
            target="_blank"
            rel="noopener noreferrer"
            className="other-games__button"
          >
            <img
              src={game.icon}
              alt={game.name}
              className="other-games__icon"
            />
            <div className="other-games__info">
              <span className="other-games__name">{game.name}</span>
              <span className="other-games__tagline">{game.tagline}</span>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
