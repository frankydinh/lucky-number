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

  const handleDownloadTemplate = () => {
    // One name per line matches how uploads are parsed and round-trips cleanly
    // (a header row would be imported as a participant, so we omit one).
    const sampleNames = ['Alice', 'Bob', 'Charlie', 'Diana', 'Ethan'];
    const csvContent = sampleNames.join('\n') + '\n';
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'lucky-draw-template.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
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

      <p className="upload-hint">
        Uploading a CSV? Use one name per line (or comma-separated).{' '}
        <button
          type="button"
          className="template-link"
          onClick={handleDownloadTemplate}
        >
          ⬇ Download template
        </button>
      </p>

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
