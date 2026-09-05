import { useState, useEffect, useRef } from 'react';

const MODES = {
  focus: { label: 'Focus', minutes: 25, color: '#f87171' },
  short: { label: 'Short Break', minutes: 5, color: '#6ee7b7' },
  long: { label: 'Long Break', minutes: 15, color: '#93c5fd' },
};

const todayKey = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

function formatDuration(totalSeconds) {
  const hrs = Math.floor(totalSeconds / 3600);
  const mins = Math.floor((totalSeconds % 3600) / 60);
  if (hrs === 0) return `${mins}m`;
  return `${hrs}h ${mins}m`;
}

function formatDateLabel(key) {
  const [y, m, d] = key.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  const today = todayKey();
  if (key === today) return 'Today';
  return date.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
}

function Pomodoro() {
  const [mode, setMode] = useState('focus');
  const [secondsLeft, setSecondsLeft] = useState(MODES.focus.minutes * 60);
  const [running, setRunning] = useState(false);
  const [history, setHistory] = useState({});
  const [showHistory, setShowHistory] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    const saved = localStorage.getItem('pomodoro-history');
    if (saved) setHistory(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem('pomodoro-history', JSON.stringify(history));
  }, [history]);

  const logSecond = () => {
    const key = todayKey();
    setHistory((prev) => {
      const day = prev[key] || { focusSeconds: 0, sessions: 0 };
      return { ...prev, [key]: { ...day, focusSeconds: day.focusSeconds + 1 } };
    });
  };

  const logSessionComplete = () => {
    const key = todayKey();
    setHistory((prev) => {
      const day = prev[key] || { focusSeconds: 0, sessions: 0 };
      return { ...prev, [key]: { ...day, sessions: day.sessions + 1 } };
    });
  };

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setSecondsLeft((s) => {
          if (mode === 'focus') logSecond();
          if (s <= 1) {
            clearInterval(intervalRef.current);
            setRunning(false);
            if (mode === 'focus') logSessionComplete();
            return 0;
          }
          return s - 1;
        });
      }, 1000);
    }
    return () => clearInterval(intervalRef.current);
  }, [running, mode]);

  const switchMode = (newMode) => {
    setMode(newMode);
    setRunning(false);
    setSecondsLeft(MODES[newMode].minutes * 60);
  };

  const toggleRunning = () => setRunning((r) => !r);
  const reset = () => {
    setRunning(false);
    setSecondsLeft(MODES[mode].minutes * 60);
  };

  const clearHistory = () => setHistory({});

  const mins = String(Math.floor(secondsLeft / 60)).padStart(2, '0');
  const secs = String(secondsLeft % 60).padStart(2, '0');
  const totalSeconds = MODES[mode].minutes * 60;
  const progress = ((totalSeconds - secondsLeft) / totalSeconds) * 100;

  const today = history[todayKey()] || { focusSeconds: 0, sessions: 0 };
  const sortedDays = Object.keys(history).sort((a, b) => (a < b ? 1 : -1));

  return (
    <div className="pomodoro">
      <div className="pomo-top-row">
        <div className="pomo-tabs">
          {Object.keys(MODES).map((m) => (
            <button
              key={m}
              className={mode === m ? 'active' : ''}
              onClick={() => switchMode(m)}
            >
              {MODES[m].label}
            </button>
          ))}
        </div>
        <button className="pomo-history-toggle" onClick={() => setShowHistory((s) => !s)}>
          History
        </button>
      </div>

      {showHistory ? (
        <div className="pomo-history-panel">
          {sortedDays.length === 0 && (
            <div className="pomo-history-empty">No sessions logged yet</div>
          )}
          {sortedDays.map((key) => {
            const day = history[key];
            return (
              <div key={key} className="pomo-history-item">
                <span className="pomo-history-date">{formatDateLabel(key)}</span>
                <span className="pomo-history-stats">
                  {formatDuration(day.focusSeconds)} · {day.sessions} session{day.sessions !== 1 ? 's' : ''}
                </span>
              </div>
            );
          })}
          {sortedDays.length > 0 && (
            <button className="pomo-history-clear" onClick={clearHistory}>
              Clear history
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="pomo-ring-wrap">
            <svg viewBox="0 0 120 120" width="180" height="180">
              <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="8" />
              <circle
                cx="60" cy="60" r="52" fill="none"
                stroke={MODES[mode].color} strokeWidth="8" strokeLinecap="round"
                strokeDasharray={2 * Math.PI * 52}
                strokeDashoffset={2 * Math.PI * 52 * (1 - progress / 100)}
                transform="rotate(-90 60 60)"
                style={{ transition: 'stroke-dashoffset 1s linear' }}
              />
            </svg>
            <div className="pomo-time">{mins}:{secs}</div>
          </div>

          <div className="pomo-controls">
            <button className="pomo-main-btn" style={{ background: MODES[mode].color }} onClick={toggleRunning}>
              {running ? 'Pause' : 'Start'}
            </button>
            <button className="pomo-reset-btn" onClick={reset}>Reset</button>
          </div>

          <div className="pomo-sessions">
            🍅 {formatDuration(today.focusSeconds)} focused today · {today.sessions} session{today.sessions !== 1 ? 's' : ''}
          </div>
        </>
      )}
    </div>
  );
}

export default Pomodoro;