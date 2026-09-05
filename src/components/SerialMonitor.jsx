import { useState, useEffect, useRef } from 'react';

const SENSORS = [
  { key: 'temp', label: 'TEMP', unit: '°C', min: 35, max: 70, decimals: 1 },
  { key: 'cpu', label: 'CPU', unit: '%', min: 5, max: 95, decimals: 0 },
  { key: 'net', label: 'NET', unit: 'ms', min: 8, max: 220, decimals: 0 },
  { key: 'mem', label: 'MEM', unit: '%', min: 20, max: 85, decimals: 0 },
];

const EVENT_MESSAGES = [
  { level: 'info', text: 'Heartbeat OK' },
  { level: 'info', text: 'Cache cleared' },
  { level: 'info', text: 'Connection re-established' },
  { level: 'warn', text: 'Latency spike detected' },
  { level: 'warn', text: 'Retry attempt scheduled' },
  { level: 'error', text: 'Request timeout' },
  { level: 'error', text: 'Packet loss detected' },
];

const SPARK_METRIC = 'cpu';
const SPARK_MAX_POINTS = 30;

function randomInRange(min, max, decimals) {
  const val = Math.random() * (max - min) + min;
  return val.toFixed(decimals);
}

function timestamp() {
  const d = new Date();
  return d.toTimeString().split(' ')[0] + '.' + String(d.getMilliseconds()).padStart(3, '0');
}

function formatUptime(seconds) {
  const h = String(Math.floor(seconds / 3600)).padStart(2, '0');
  const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
  const s = String(seconds % 60).padStart(2, '0');
  return `${h}:${m}:${s}`;
}

function SerialMonitor() {
  const [lines, setLines] = useState([]);
  const [running, setRunning] = useState(true);
  const [readings, setReadings] = useState(() =>
    SENSORS.reduce((acc, s) => ({ ...acc, [s.key]: randomInRange(s.min, s.max, s.decimals) }), {})
  );
  const [sparkData, setSparkData] = useState([]);
  const [uptime, setUptime] = useState(0);
  const scrollRef = useRef(null);
  const lineId = useRef(0);

  const addLine = (level, text) => {
    lineId.current += 1;
    setLines((prev) => [...prev.slice(-80), { id: lineId.current, level, text }]);
  };

  useEffect(() => {
    const uptimeInterval = setInterval(() => setUptime((u) => u + 1), 1000);
    return () => clearInterval(uptimeInterval);
  }, []);

  useEffect(() => {
    if (!running) return;
    const interval = setInterval(() => {
      const roll = Math.random();

      if (roll < 0.75) {
        const metric = SENSORS[Math.floor(Math.random() * SENSORS.length)];
        const value = randomInRange(metric.min, metric.max, metric.decimals);
        setReadings((prev) => ({ ...prev, [metric.key]: value }));
        addLine('info', `${metric.label}=${value}${metric.unit}`);

        if (metric.key === SPARK_METRIC) {
          setSparkData((prev) => [...prev.slice(-(SPARK_MAX_POINTS - 1)), parseFloat(value)]);
        }
      } else {
        const event = EVENT_MESSAGES[Math.floor(Math.random() * EVENT_MESSAGES.length)];
        addLine(event.level, event.text);
      }
    }, 450);
    return () => clearInterval(interval);
  }, [running]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [lines]);

  const clearLog = () => setLines([]);

  const exportLog = () => {
    const content = lines.map((l) => `[${l.level.toUpperCase()}] ${l.text}`).join('\n');
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'system-log.txt';
    link.click();
    URL.revokeObjectURL(url);
  };

  const sparkWidth = 260;
  const sparkHeight = 40;
  const sparkPoints = sparkData.map((val, i) => {
    const x = (i / (SPARK_MAX_POINTS - 1)) * sparkWidth;
    const y = sparkHeight - (val / 100) * sparkHeight;
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="serial-monitor">
      <div className="serial-status-bar">
        <span className="serial-uptime">⏱ Uptime: {formatUptime(uptime)}</span>
        <span className={`serial-status-dot ${running ? 'live' : ''}`}>{running ? '● Live' : '○ Paused'}</span>
      </div>

      <div className="serial-readouts">
        {SENSORS.map((s) => (
          <div key={s.key} className="serial-readout">
            <div className="serial-readout-label">{s.label}</div>
            <div className="serial-readout-value">
              {readings[s.key]}<span className="serial-readout-unit">{s.unit}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="serial-spark-wrap">
        <div className="serial-spark-label">CPU trend</div>
        <svg viewBox={`0 0 ${sparkWidth} ${sparkHeight}`} className="serial-spark-svg" preserveAspectRatio="none">
          {sparkData.length > 1 && (
            <polyline points={sparkPoints} fill="none" stroke="#6ee7b7" strokeWidth="2" />
          )}
        </svg>
      </div>

      <div className="serial-console" ref={scrollRef}>
        {lines.length === 0 && <div className="serial-console-empty">Waiting for data…</div>}
        {lines.map((line) => (
          <div key={line.id} className={`serial-console-line level-${line.level}`}>
            [{line.level.toUpperCase()}] {line.text}
          </div>
        ))}
      </div>

      <div className="serial-controls">
        <button className="serial-btn" onClick={() => setRunning((r) => !r)}>
          {running ? '⏸ Pause' : '▶ Resume'}
        </button>
        <button className="serial-btn" onClick={clearLog}>Clear</button>
        <button className="serial-btn" onClick={exportLog}>Export .txt</button>
      </div>
    </div>
  );
}

export default SerialMonitor;