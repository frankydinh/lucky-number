import './ModeSelector.css';

const MODES = [
  { id: 'wheel', icon: '🎡', title: 'Wheel of Names', desc: 'Spinning wheel animation' },
  { id: 'racing', icon: '🏎️', title: 'Racing Car', desc: 'Race to the finish with Top 3' },
  { id: 'fish', icon: '🐟', title: 'Fish Race', desc: 'Swim to the finish with Top 3' },
  { id: 'horse', icon: '🐎', title: 'Horse Race', desc: 'Gallop to the finish with Top 3' },
];

function ModeSelector({ mode, setMode }) {
  return (
    <div className="mode-selector-container">
      <h2>Select Draw Mode</h2>
      <div className="mode-options">
        {MODES.map((m) => (
          <div
            key={m.id}
            className={`mode-option ${mode === m.id ? 'active' : ''}`}
            onClick={() => setMode(m.id)}
          >
            <div className="mode-icon">{m.icon}</div>
            <h3>{m.title}</h3>
            <p>{m.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ModeSelector;
