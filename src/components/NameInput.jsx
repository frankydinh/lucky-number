import { useState } from 'react';
import './NameInput.css';

function NameInput({ names, setNames }) {
  const [inputText, setInputText] = useState('');

  const handleTextChange = (e) => {
    setInputText(e.target.value);
  };

  const handleAddNames = () => {
    const nameList = inputText
      .split(/[,\n]/)
      .map(name => name.trim())
      .filter(name => name.length > 0);
    
    if (nameList.length > 0) {
      setNames([...names, ...nameList]);
      setInputText('');
    }
  };

  const handleRemoveName = (index) => {
    setNames(names.filter((_, i) => i !== index));
  };

  const handleClearAll = () => {
    setNames([]);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target.result;
        const nameList = text
          .split(/[,\n]/)
          .map(name => name.trim())
          .filter(name => name.length > 0);
        setNames([...names, ...nameList]);
      };
      reader.readAsText(file);
      e.target.value = '';
    }
  };

  return (
    <div className="name-input-container">
      <h2>Enter Names</h2>
      <textarea
        value={inputText}
        onChange={handleTextChange}
        placeholder="Enter names separated by commas or new lines&#10;Example: Alice, Bob, Charlie&#10;or one name per line"
        rows="5"
      />
      <div className="name-input-actions">
        <button onClick={handleAddNames} disabled={!inputText.trim()}>
          Add Names
        </button>
        <label className="file-upload-btn">
          Upload CSV
          <input
            type="file"
            accept=".csv,.txt"
            onChange={handleFileUpload}
            style={{ display: 'none' }}
          />
        </label>
      </div>

      {names.length > 0 && (
        <div className="names-list">
          <div className="names-list-header">
            <h3>Names ({names.length})</h3>
            <button onClick={handleClearAll} className="btn-clear">
              Clear All
            </button>
          </div>
          <div className="names-chips">
            {names.map((name, index) => (
              <div key={index} className="name-chip">
                <span>{name}</span>
                <button onClick={() => handleRemoveName(index)}>&times;</button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default NameInput;
