import { useState } from 'react';
import './App.css';
import NameInput from './components/NameInput';
import ModeSelector from './components/ModeSelector';
import DurationSettings from './components/DurationSettings';
import WheelOfNames from './components/WheelOfNames';
import RacingCar from './components/RacingCar';
import WinnerDisplay from './components/WinnerDisplay';

function App() {
  const [names, setNames] = useState([]);
  const [mode, setMode] = useState('wheel'); // 'wheel' or 'racing'
  const [duration, setDuration] = useState(60); // in seconds
  const [isDrawing, setIsDrawing] = useState(false);
  const [winner, setWinner] = useState(null);
  const [removeWinner, setRemoveWinner] = useState(false);
  const [showSettings, setShowSettings] = useState(true);

  const handleStart = () => {
    if (names.length === 0) {
      alert('Please add at least one name!');
      return;
    }
    setIsDrawing(true);
    setWinner(null);
    setShowSettings(false);
  };

  const handleComplete = (selectedWinner, topThree = null) => {
    setIsDrawing(false);
    setWinner(topThree || selectedWinner);
    
    // Remove winner from names if option is enabled (only for wheel mode)
    if (mode === 'wheel' && removeWinner && selectedWinner) {
      setNames(prevNames => prevNames.filter(name => name !== selectedWinner));
    }
  };

  const handleReset = () => {
    setWinner(null);
    setShowSettings(true);
    setIsDrawing(false);
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>🍀 Lucky Draw</h1>
        <p>Random Name Picker with Wheel & Racing Modes</p>
      </header>

      {showSettings && !isDrawing && (
        <div className="settings-container">
          <NameInput names={names} setNames={setNames} />
          <ModeSelector mode={mode} setMode={setMode} />
          <DurationSettings duration={duration} setDuration={setDuration} />
          
          {mode === 'wheel' && (
            <div className="option-toggle">
              <label>
                <input
                  type="checkbox"
                  checked={removeWinner}
                  onChange={(e) => setRemoveWinner(e.target.checked)}
                />
                Remove winner from next draw
              </label>
            </div>
          )}

          <button className="btn-start" onClick={handleStart} disabled={names.length === 0}>
            Start Draw
          </button>
        </div>
      )}

      {isDrawing && mode === 'wheel' && (
        <WheelOfNames 
          names={names} 
          duration={duration} 
          onComplete={handleComplete}
        />
      )}

      {isDrawing && mode === 'racing' && (
        <RacingCar 
          names={names} 
          duration={duration} 
          onComplete={handleComplete}
        />
      )}

      {winner && !isDrawing && (
        <WinnerDisplay 
          winner={winner} 
          mode={mode} 
          onReset={handleReset}
        />
      )}
    </div>
  );
}

export default App;
