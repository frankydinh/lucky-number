import './ModeSelector.css';

function ModeSelector({ mode, setMode }) {
  return (
    <div className="mode-selector-container">
      <h2>Select Draw Mode</h2>
      <div className="mode-options">
        <div
          className={`mode-option ${mode === 'wheel' ? 'active' : ''}`}
          onClick={() => setMode('wheel')}
        >
          <div className="mode-icon">🎡</div>
          <h3>Wheel of Names</h3>
          <p>Spinning wheel animation</p>
        </div>
        <div
          className={`mode-option ${mode === 'racing' ? 'active' : ''}`}
          onClick={() => setMode('racing')}
        >
          <div className="mode-icon">🏎️</div>
          <h3>Racing Car</h3>
          <p>Race to the finish with Top 3</p>
        </div>
      </div>
    </div>
  );
}

export default ModeSelector;
