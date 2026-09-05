import { useState, useEffect, useRef } from 'react';

const COLORS = ['#fde68a', '#bbf7d0', '#bfdbfe', '#fbcfe8', '#ddd6fe'];

function StickyNotesPanel() {
  const [notes, setNotes] = useState([]);
  const hasLoaded = useRef(false);

  useEffect(() => {
    const saved = localStorage.getItem('desktop-sticky-notes');
    if (saved) setNotes(JSON.parse(saved));
    hasLoaded.current = true;
  }, []);

  useEffect(() => {
    if (!hasLoaded.current) return;
    localStorage.setItem('desktop-sticky-notes', JSON.stringify(notes));
  }, [notes]);

  const addNote = () => {
    const color = COLORS[Math.floor(Math.random() * COLORS.length)];
    setNotes([...notes, { id: Date.now(), text: '', color }]);
  };

  const updateNote = (id, text) => {
    setNotes((prev) => prev.map((n) => (n.id === id ? { ...n, text } : n)));
  };

  const deleteNote = (id) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <div className="sticky-notes">
      <button className="sticky-add-btn" onClick={addNote}>+ New Note</button>

      <div className="sticky-grid">
        {notes.length === 0 && (
          <div className="sticky-empty">No notes yet — add one above</div>
        )}
        {notes.map((note) => (
          <div key={note.id} className="sticky-note" style={{ background: note.color }}>
            <button className="sticky-delete" onClick={() => deleteNote(note.id)}>✕</button>
            <textarea
              value={note.text}
              onChange={(e) => updateNote(note.id, e.target.value)}
              placeholder="Write something…"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default StickyNotesPanel;