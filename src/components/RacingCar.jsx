import { useEffect, useState, useRef } from 'react';
import './RacingCar.css';

const LANE_COLORS = [
  '#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6',
  '#EC4899', '#14B8A6', '#F97316', '#06B6D4', '#6366F1'
];

// Each racing mode reuses the same mechanics with a different look & feel.
// Every racer in a mode shares one icon; lanes are told apart by colour.
const THEMES = {
  car: {
    emoji: '🏎️',
    text: '🏁 Racing to the finish...',
  },
  fish: {
    emoji: '🐟',
    text: '🐟 Swimming to the finish...',
  },
  horse: {
    emoji: '🐎',
    text: '🐎 Galloping to the finish...',
  },
};

// Smooth ease-in-out so cars accelerate and settle naturally.
const easeInOut = (t) =>
  t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;

function RacingCar({ names, duration, onComplete, theme = 'car' }) {
  const { emoji, text } = THEMES[theme] || THEMES.car;
  // Progress is keyed by car index (not name) so duplicate names still race
  // independently.
  const [progress, setProgress] = useState([]);
  // RacingCar only renders while a race is in progress, so it starts racing.
  const [isRacing, setIsRacing] = useState(true);
  // Keep the latest onComplete without restarting the race when it changes.
  const onCompleteRef = useRef(onComplete);
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    if (names.length === 0) return undefined;

    // Pick the winner up front so the finish is deterministic.
    const winnerIndex = Math.floor(Math.random() * names.length);
    const raceDuration = Math.max(duration, 1) * 1000;

    // Each car gets a final position. The winner reaches the finish line (100%);
    // everyone else finishes behind, spread out in a random order.
    const nonWinners = names
      .map((_, i) => i)
      .filter((i) => i !== winnerIndex)
      .sort(() => Math.random() - 0.5);

    const targets = new Array(names.length);
    targets[winnerIndex] = 100;
    nonWinners.forEach((carIndex, rank) => {
      const spread = nonWinners.length > 1 ? rank / (nonWinners.length - 1) : 0;
      // Finishes fan out between ~92% (just behind) and ~60% (trailing).
      targets[carIndex] = 92 - spread * 32 + (Math.random() * 4 - 2);
    });

    // Per-car pacing: the winner lags early and surges late for a dramatic
    // finish; rivals get off the line quickly, then level off.
    const pace = names.map((_, i) =>
      i === winnerIndex ? 1.3 + Math.random() * 0.3 : 0.85 + Math.random() * 0.25
    );

    // Subtle wobble creates mid-race jostling/overtaking that settles by the end.
    const wobbleFreq = names.map(() => 1 + Math.random() * 2);
    const wobblePhase = names.map(() => Math.random() * Math.PI * 2);
    const wobbleAmp = names.map(() => 2 + Math.random() * 3);

    const startTime = performance.now();
    let intervalId = null;

    // Driven by a timer (not requestAnimationFrame) so the race keeps
    // progressing and always finishes even if the tab is hidden or RAF is
    // throttled. Timing is derived from performance.now(), and the CSS
    // `transition` on the car keeps motion smooth between ticks.
    const tick = () => {
      const u = Math.min((performance.now() - startTime) / raceDuration, 1);
      const newProgress = names.map((_, i) => {
        const eased = easeInOut(Math.min(Math.pow(u, pace[i]), 1));
        const base = targets[i] * eased;
        const wobble =
          Math.sin(u * Math.PI * 2 * wobbleFreq[i] + wobblePhase[i]) *
          wobbleAmp[i] *
          (1 - u);
        // Once the race is over, pin to exact targets so the visual order
        // matches the reported results.
        if (u >= 1) return targets[i];
        return Math.max(0, Math.min(base + wobble, 100));
      });

      setProgress(newProgress);

      if (u >= 1) {
        clearInterval(intervalId);
        intervalId = null;
        setIsRacing(false);
        const ranking = names
          .map((name, i) => ({ name, position: targets[i] }))
          .sort((a, b) => b.position - a.position);
        const top3 = ranking
          .slice(0, 3)
          .map((racer, idx) => ({ name: racer.name, position: idx + 1 }));
        onCompleteRef.current(top3[0].name, top3);
      }
    };

    tick();
    intervalId = setInterval(tick, 1000 / 60);

    return () => {
      if (intervalId !== null) {
        clearInterval(intervalId);
      }
    };
  }, [names, duration]);

  return (
    <div className={`racing-container theme-${theme}`}>
      <div className="race-track">
        <div className="finish-line">
          <div className="finish-flag">🏁</div>
        </div>

        {names.map((name, index) => (
          <div key={index} className="race-lane">
            <div className="lane-name">{name}</div>
            <div className="lane-track">
              <div
                className="race-car"
                style={{ left: `${progress[index] || 0}%` }}
              >
                <span
                  className="race-car-body"
                  style={{ backgroundColor: LANE_COLORS[index % LANE_COLORS.length] }}
                >
                  {/* Emojis face left by default; flip them to face the finish line. */}
                  <span className="race-car-emoji">
                    {emoji}
                  </span>
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isRacing && (
        <div className="racing-text">
          <p>{text}</p>
        </div>
      )}
    </div>
  );
}

export default RacingCar;
