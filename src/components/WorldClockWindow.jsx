import {useState} from 'react';
import WorldClock from "./WorldClock";

function WorldClockWindow(){
    const[isOpen, setIsOpen] = useState(false);
    return (
    <>
      <button className="dock-icon" onClick={() => setIsOpen(true)}>
        🕐
      </button>

      {isOpen && (
        <div className="modal-overlay" onClick={() => setIsOpen(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <span className="modal-title">World Clock</span>
              <button className="modal-close" onClick={() => setIsOpen(false)}>✕</button>
            </div>
            <div className="modal-body">
              <WorldClock />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default WorldClockWindow;