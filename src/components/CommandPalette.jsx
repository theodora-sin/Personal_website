import { useState, useEffect, useRef } from 'react';

function CommandPalette({ isOpen, onClose, commands }) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);

  const filtered = commands.filter((c) =>
    c.label.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 10);
    }
  }, [isOpen]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  const KeyDown = (e) => {
    if (e.key === 'Escape') onClose();
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((i) => Math.min(i + 1, filtered.length - 1));
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((i) => Math.max(i - 1, 0));
    }
    if (e.key === 'Enter' && filtered[selectedIndex]) {
      filtered[selectedIndex].onRun();
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="palette-overlay" onClick={onClose}>
      <div className="palette-box" onClick={(e) => e.stopPropagation()}>
        <input
          ref={inputRef}
          className="palette-input"
          placeholder="Type a command…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={KeyDown}
        />
        <ul className="palette-list">
          {filtered.length === 0 && <li className="palette-empty">No matching commands</li>}
          {filtered.map((cmd, i) => (
            <li
              key={cmd.label}
              className={i === selectedIndex ? 'active' : ''}
              onMouseEnter={() => setSelectedIndex(i)}
              onClick={() => {
                cmd.onRun();
                onClose();
              }}
            >
              <span className="palette-icon">{cmd.icon}</span>
              {cmd.label}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default CommandPalette;