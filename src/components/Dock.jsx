function Dock({ items, activeTypes = []}) {
  return (
    <div className="dock">
      {items.map((item) => (
        <div key={item.id} className="dock-icon-wrap">
          <button className="dock-icon" onClick={item.onClick} title={item.label}>
            {item.icon}
          </button>
          {activeTypes.includes(item.id) && <span className="dock-running-dot" />}
        </div>
      ))}
    </div>
  );
}

export default Dock;