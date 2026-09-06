import { useState, useEffect, useRef } from 'react';

/*different color sticky notes*/
const COLORS = ['#fde68a', '#bbf7d0', '#bfdbfe', '#fbcfe8', '#ddd6fe', '#f6d5e8'];

function StickyNotes() {
  const [notes, setNotes] = useState([]);
  const hasLoaded = useRef(false);
  /*local storage*/
  useEffect(() => {
    const saved = localStorage.getItem('desktop-sticky-notes');
    if (saved) setNotes(JSON.parse(saved));
    hasLoaded.current = true;
  }, []);

  useEffect(() => {
    if (!hasLoaded.current) return;
    localStorage.setItem('desktop-sticky-notes', JSON.stringify(notes));
  }, [notes]);

  /*add note*/
  const add = () => {
    const color = COLORS[Math.floor(Math.random() * COLORS.length)];
    setNotes([...notes, { id: Date.now(), text: '', color }]);
  };
  /*update note*/
  const update = (id, text) => {
    setNotes((prev) => prev.map((n) => (n.id === id ? { ...n, text } : n)));
  };

  /*delete note*/
  const Delete = (id) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <div className="sticky-notes">
      <button className="sticky-add-btn" onClick={add}>+ New Note</button>

      <div className="sticky-grid">
        {notes.length === 0 && (
          <div className="sticky-empty">No notes yet — add one above</div>
        )}
        {notes.map((note) => (
          <div key={note.id} className="sticky-note" style={{ background: note.color }}>
            <button className="sticky-delete" onClick={() => Delete(note.id)}>✕</button>
            <textarea
              value={note.text}
              onChange={(e) => update(note.id, e.target.value)}
              placeholder="Write something…"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default StickyNotes;