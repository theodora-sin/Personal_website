import { useState, useEffect } from 'react';

const PRIORITY_CONFIG = {
  low: { color: '#6ee7b7', label: 'Low' },
  medium: { color: '#fbbf24', label: 'Medium' },
  high: { color: '#f87171', label: 'High' },
};

function Todo() {
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState('');
  const [priority, setPriority] = useState('medium');
  const [priorityOpen, setPriorityOpen] = useState(false);
  const [dueDate, setDueDate] = useState('');
  const [filter, setFilter] = useState('all');
  const [celebrate, setCelebrate] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('desktop-todos');
    if (saved) setTasks(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem('desktop-todos', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (!input.trim()) return;
    setTasks([
      ...tasks,
      { id: Date.now(), text: input.trim(), done: false, priority, dueDate },
    ]);
    setInput('');
    setDueDate('');
  };

  const toggleTask = (id) => {
    setTasks((prev) => {
      const updated = prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t));
      const justCompleted = updated.find((t) => t.id === id)?.done;
      if (justCompleted) {
        setCelebrate(true);
        setTimeout(() => setCelebrate(false), 900);
      }
      return updated;
    });
  };

  const deleteTask = (id) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const clearCompleted = () => {
    setTasks((prev) => prev.filter((t) => !t.done));
  };

  const startEdit = (task) => {
    setEditingId(task.id);
    setEditText(task.text);
  };

  const saveEdit = (id) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, text: editText.trim() || t.text } : t))
    );
    setEditingId(null);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') addTask();
  };

  const total = tasks.length;
  const doneCount = tasks.filter((t) => t.done).length;
  const progress = total === 0 ? 0 : Math.round((doneCount / total) * 100);

  const filteredTasks = tasks.filter((t) => {
    if (filter === 'all') return true;
    if (filter === 'active') return !t.done;
    if (filter === 'done') return t.done;
    return t.priority === filter;
  });

  const isOverdue = (dateStr, done) => {
    if (!dateStr || done) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return new Date(dateStr) < today;
  };

return (
  <div className="todo-body">
    {total > 0 && (
      <div className="todo-progress-wrap">
        <div className="todo-progress-label">
          <span>{doneCount} of {total} done</span>
          <span>{progress}%</span>
        </div>
        <div className="todo-progress-track">
          <div className="todo-progress-fill" style={{ width: `${progress}%` }} />
        </div>
      </div>
    )}

    <div className="todo-input-row">
      <input
        type="text"
        placeholder="Add a task…"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
      />

      <div className="priority-dropdown">
        <button
          type="button"
          className="priority-dropdown-btn"
          style={{ color: PRIORITY_CONFIG[priority].color }}
          onClick={() => setPriorityOpen((o) => !o)}
        >
          {PRIORITY_CONFIG[priority].label} ▾
        </button>
        {priorityOpen && (
          <div className="priority-dropdown-menu">
            {Object.keys(PRIORITY_CONFIG).map((key) => (
              <div
                key={key}
                className="priority-dropdown-item"
                style={{ color: PRIORITY_CONFIG[key].color }}
                onClick={() => {
                  setPriority(key);
                  setPriorityOpen(false);
                }}
              >
                {PRIORITY_CONFIG[key].label}
              </div>
            ))}
          </div>
        )}
      </div>

      <button onClick={addTask}>+</button>
    </div>

    <div className="todo-input-row secondary">
      <input
        type="date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
      />
    </div>

    <div className="todo-filters">
      {['all', 'active', 'done', 'high', 'medium', 'low'].map((f) => (
        <button
          key={f}
          className={filter === f ? 'active' : ''}
          onClick={() => setFilter(f)}
        >
          {f}
        </button>
      ))}
    </div>

    {['high', 'medium', 'low'].map((level) => {
      const group = filteredTasks.filter((t) => (t.priority || 'medium') === level);
      if (group.length === 0) return null;
      return (
        <div key={level} className="todo-group">
          <div className="todo-group-header" style={{ color: PRIORITY_CONFIG[level].color }}>
            {PRIORITY_CONFIG[level].label} Priority
            <span className="todo-group-count">{group.length}</span>
          </div>
          <ul className="todo-list">
            {group.map((task) => (
              <li key={task.id} className={task.done ? 'done' : ''}>
                <span className="todo-checkbox" onClick={() => toggleTask(task.id)}>
                  {task.done ? '☑' : '☐'}
                </span>

                {editingId === task.id ? (
                  <input
                    className="todo-edit-input"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    onBlur={() => saveEdit(task.id)}
                    onKeyDown={(e) => e.key === 'Enter' && saveEdit(task.id)}
                    autoFocus
                  />
                ) : (
                  <span className="todo-text" onDoubleClick={() => startEdit(task)}>
                    {task.text}
                  </span>
                )}

                {task.dueDate && (
                  <span className={`due-date ${isOverdue(task.dueDate, task.done) ? 'overdue' : ''}`}>
                    {new Date(task.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                  </span>
                )}

                <button className="todo-delete" onClick={() => deleteTask(task.id)}>✕</button>
              </li>
            ))}
          </ul>
        </div>
      );
    })}

    {filteredTasks.length === 0 && (
      <div className="todo-empty">
        <div className="todo-empty-icon">🌙</div>
        <div>Nothing here yet</div>
      </div>
    )}

    {doneCount > 0 && (
      <button className="clear-done-btn" onClick={clearCompleted}>
        Clear completed
      </button>
    )}

    {celebrate && <div className="todo-celebrate">✨</div>}
  </div>
);
}

export default Todo;