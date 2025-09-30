import './confetti.css';

export function Confetti() {
  return (
    <div className="confetti-container">
      {[...Array(150)].map((_, i) => (
        <div key={i} className="confetti"></div>
      ))}
    </div>
  );
}
