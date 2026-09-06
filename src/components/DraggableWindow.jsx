import { useState, useRef, useEffect } from 'react';

function DraggableWindow({
  title, onClose, onFocus, onMinimize, children,
  width = 420, height = null, zIndex = 10, cascadeIndex = 0, minimized = false,
  initialPosition = null, initialSize = null,
  PositionChange, onSizeChange,
}) {
  const [position, setPosition] = useState(initialPosition || { x: null, y: null });
  const [size, setSize] = useState(initialSize || { width, height });
  const dragging = useRef(false);
  const resizing = useRef(false);
  const dragOffset = useRef({ x: 0, y: 0 });
  const resizeStart = useRef({ x: 0, y: 0, width: 0, height: 0 });
  const latestPosition = useRef(position);
  const latestSize = useRef(size);

  const cascade = cascadeIndex * 28;
  
  useEffect(() => {
    if (position.x !== null) {
      const effectiveWidth = Math.min(size.width, window.innerWidth * 0.92);
      const maxX = Math.max(10, window.innerWidth - effectiveWidth - 10);
      const maxY = Math.max(10, window.innerHeight - 80);
      const clampedX = Math.min(Math.max(position.x, 10), maxX);
      const clampedY = Math.min(Math.max(position.y, 10), maxY);
      if (clampedX !== position.x || clampedY !== position.y) {
        const next = { x: clampedX, y: clampedY };
        setPosition(next);
        latestPosition.current = next;
        if (PositionChange) PositionChange(next);
      }
    }
  }, []);

  const onMouseDown = (e) => {
    e.preventDefault();
    dragging.current = true;
    const rect = e.currentTarget.parentElement.getBoundingClientRect();
    dragOffset.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  const onMouseMove = (e) => {
    if (!dragging.current) return;
    const next = { x: e.clientX - dragOffset.current.x, y: e.clientY - dragOffset.current.y };
    latestPosition.current = next;
    setPosition(next);
  };

  const onMouseUp = () => {
    dragging.current = false;
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
    if (PositionChange) onPositionChange(latestPosition.current);
  };

  const onResizeMouseDown = (e) => {
    e.preventDefault();
    e.stopPropagation();
    resizing.current = true;
    resizeStart.current = {
      x: e.clientX,
      y: e.clientY,
      width: size.width,
      height: size.height || e.currentTarget.parentElement.offsetHeight,
    };
    document.addEventListener('mousemove', onResizeMouseMove);
    document.addEventListener('mouseup', onResizeMouseUp);
  };

  const onResizeMouseMove = (e) => {
    if (!resizing.current) return;
    const deltaX = e.clientX - resizeStart.current.x;
    const deltaY = e.clientY - resizeStart.current.y;
    const next = {
      width: Math.max(280, resizeStart.current.width + deltaX),
      height: Math.max(200, resizeStart.current.height + deltaY),
    };
    latestSize.current = next;
    setSize(next);
  };

  const onResizeMouseUp = () => {
    resizing.current = false;
    document.removeEventListener('mousemove', onResizeMouseMove);
    document.removeEventListener('mouseup', onResizeMouseUp);
    if (onSizeChange) onSizeChange(latestSize.current);
  };

  if (minimized) return null;

  const posStyle =
    position.x !== null
      ? { left: position.x, top: position.y }
      : { left: `calc(50% + ${cascade}px)`, top: `calc(50% + ${cascade}px)`, transform: 'translate(-50%, -50%)' };

  return (
    <div
      className="draggable-window"
      style={{ width: size.width, height: size.height || 'auto', zIndex, ...posStyle }}
      onMouseDown={onFocus}
    >
      <div className="window-titlebar" onMouseDown={onMouseDown}>
        <span className="window-title">{title}</span>
        <div className="window-actions">
          <button className="window-minimize" onClick={(e) => { e.stopPropagation(); onMinimize(); }}>─</button>
          <button className="window-close" onClick={(e) => { e.stopPropagation(); onClose(); }}>✕</button>
        </div>
      </div>
      <div className="window-content">{children}</div>
      <div className="resize-handle" onMouseDown={onResizeMouseDown}>
        <svg width="10" height="10" viewBox="0 0 10 10">
          <path d="M9 1L1 9M9 5L5 9M9 9L9 9" stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
        </svg>
      </div>
    </div>
  );
}

export default DraggableWindow;