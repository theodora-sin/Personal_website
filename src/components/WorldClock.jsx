import { useState, useEffect, useRef } from 'react';
import { cities } from '../data/cities';

/*UTC time zone*/
function Offset(timeZone, now) {
  const utcDate = new Date(now.toLocaleString('en-US', { timeZone: 'UTC' }));
  const tzDate = new Date(now.toLocaleString('en-US', { timeZone }));
  const diffHours = Math.round((tzDate - utcDate) / (1000 * 60 * 60));
  return diffHours >= 0 ? `UTC+${diffHours}` : `UTC${diffHours}`;
}

/*compare UTC timezone*/
function Relative(timeZone, now) {
  const localTZ = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const localDate = new Date(now.toLocaleString('en-US', { timeZone: localTZ }));
  const tzDate = new Date(now.toLocaleString('en-US', { timeZone }));
  const diffHours = Math.round((tzDate - localDate) / (1000 * 60 * 60));
  if (diffHours === 0) return 'Same as you';
  const direction = diffHours > 0 ? 'ahead' : 'behind';
  return `${Math.abs(diffHours)}h ${direction} of you`;
}

/*day vs night time */
function Daytime(timeZone, now) {
  const hour = parseInt(
    now.toLocaleTimeString('en-US', { timeZone, hour: '2-digit', hour12: false }),
    10
  );
  return hour >= 6 && hour < 18;
}

function WorldClock() {
  const [index, setIndex] = useState(0);
  const [now, setNow] = useState(new Date());
  const touchStartX = useRef(null);

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const goNext = () => setIndex((i) => (i + 1) % cities.length);
  const goPrev = () => setIndex((i) => (i - 1 + cities.length) % cities.length);

  /*arrow bar, change location*/
  const handleTouchStart = (e) => { touchStartX.current = e.touches[0].clientX; };
  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    if (deltaX < -50) goNext();
    if (deltaX > 50) goPrev();
    touchStartX.current = null;
  };
/*time*/
  const city = cities[index];
  const timeString = now.toLocaleTimeString('en-US', {
    timeZone: city.timeZone, hour: '2-digit', minute: '2-digit', second: '2-digit',
  });
  /*date*/
  const dateString = now.toLocaleDateString('en-US', {
    timeZone: city.timeZone, weekday: 'long', month: 'long', day: 'numeric',
  });
  const offsetLabel = Offset(city.timeZone, now);
  const relativeLabel =Relative(city.timeZone, now);
  const daytime = Daytime(city.timeZone, now);

  return (
    <div className="world-clock-panel" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
      <button className="arrow left" onClick={goPrev}>‹</button>

      <div className="clock-content">
        <div className="city-name">
          {city.flag} {city.name}, {city.country} {daytime ? '☀️' : '🌙'}
        </div>
        <div className="city-time">{timeString}</div>
        <div className="city-date">{dateString}</div>
        <div className="city-meta">
          <span className="offset-badge">{offsetLabel}</span>
          <span className="relative-label">{relativeLabel}</span>
        </div>
      </div>

      <button className="arrow right" onClick={goNext}>›</button>

      <div className="dots">
        {cities.map((c, i) => (
          <span key={c.name} className={`dot ${i === index ? 'active' : ''}`} onClick={() => setIndex(i)}></span>
        ))}
      </div>
    </div>
  );
}

export default WorldClock;