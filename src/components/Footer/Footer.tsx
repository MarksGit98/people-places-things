import './Footer.css';

export function Footer() {
  return (
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
  );
}
