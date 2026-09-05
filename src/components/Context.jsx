import { useEffect, useRef } from 'react';

function Context({ x, y, onClose, items }) {
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) onClose();
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [onClose]);

  return (
    <div className="context-menu" style={{ left: x, top: y }} ref={menuRef}>
      {items.map((item, i) =>
        item.divider ? (
          <div key={i} className="context-menu-divider" />
        ) : (
          <button
            key={i}
            className="context-menu-item"
            onClick={() => {
              item.onClick();
              onClose();
            }}
          >
            <span className="context-menu-icon">{item.icon}</span>
            {item.label}
          </button>
        )
      )}
    </div>
  );
}

export default Context;