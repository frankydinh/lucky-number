import './DurationSettings.css';

function DurationSettings({ duration, setDuration }) {
  const presetDurations = [5, 10, 30, 60];

  const handleSliderChange = (e) => {
    setDuration(parseInt(e.target.value));
  };

  return (
    <div className="duration-settings-container">
      <h2>Set Duration</h2>
      <div className="duration-display">
        <span className="duration-value">{duration}</span>
        <span className="duration-unit">seconds</span>
      </div>
      
      <input
        type="range"
        min="10"
        max="180"
        step="5"
        value={duration}
        onChange={handleSliderChange}
        className="duration-slider"
      />
      
      <div className="duration-presets">
        {presetDurations.map((preset) => (
          <button
            key={preset}
            onClick={() => setDuration(preset)}
            className={duration === preset ? 'active' : ''}
          >
            {preset}s
          </button>
        ))}
      </div>
    </div>
  );
}

export default DurationSettings;
