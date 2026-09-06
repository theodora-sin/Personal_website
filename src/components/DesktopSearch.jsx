import {useState, useEffect, useRef} from 'react';
function DesktopSearch({apps, onOpenApp}) {
    const[isOpen, setIsOpen] = useState(false);
    const[query,setQuery] = useState('');
    const inputRef = useRef(null);
/*timeout*/
    useEffect(()=>{
        if(isOpen) setTimeout(() => inputRef.current?.focus(),10);
    }, [isOpen]);
/*to do list*/
    const Todo = () =>{
        try{
            const saved = localStorage.getItem('desktop-todos');
            return saved ? JSON.parse (saved) : [];
        } catch(err) {
            return[];
        }
    };

    const appResults = apps.filter((a) => a.label.toLowerCase().includes(query.toLowerCase()));
    const todoResults = query.trim()
        ? Todo().filter((t) => t.text.toLowerCase().includes(query.toLowerCase()))
        : [];

    const handleClose =() =>{
        setIsOpen(false);
        setQuery('');
    }
  return (
    <div className="desktop-search">
      {!isOpen && (
        <button className="search-trigger" onClick={() => setIsOpen(true)}>🔍</button>
      )}
      {isOpen && (
        <div className="search-panel">
          <div className="search-input-row">
            <input
              ref={inputRef}
              type="text"
              placeholder="Search apps or tasks…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Escape') handleClose(); }}
            />
            <button className="search-close" onClick={handleClose}>✕</button>
          </div>

          {query.trim() === '' ? (
            <div className="search-hint">Type to search apps and tasks</div>
          ) : (
            <div className="search-results">
              {appResults.length > 0 && (
                <div className="search-group">
                  <div className="search-group-label">Apps</div>
                  {appResults.map((a) => (
                    <div
                      key={a.id}
                      className="search-result-item"
                      onClick={() => { onOpenApp(a.id); handleClose(); }}
                    >
                      <span className="search-result-icon">{a.icon}</span>
                      {a.label}
                    </div>
                  ))}
                </div>
              )}

              {todoResults.length > 0 && (
                <div className="search-group">
                  <div className="search-group-label">Tasks</div>
                  {todoResults.map((t) => (
                    <div
                      key={t.id}
                      className="search-result-item"
                      onClick={() => { onOpenApp('todo'); handleClose(); }}
                    >
                      <span className="search-result-icon">{t.done ? '☑' : '☐'}</span>
                      {t.text}
                    </div>
                  ))}
                </div>
              )}

              {appResults.length === 0 && todoResults.length === 0 && (
                <div className="search-empty">No matches found</div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default DesktopSearch;