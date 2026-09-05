import { useState, useEffect, useRef } from 'react';

const IDLE_THRESHOLD = 15000;
const MASCOT_SWITCH_INTERVAL = 30000;
const MASCOT_IMAGES= ['/Mascot.png', '/mascot1.png']
const MESSAGES = [
  "Just chilling here~",
  "Don't forget to check your to-do list!",
  "It's a good time for a break ☕",
  "Let interest take over curriculum",
  "Make your dream comes true!"
];

function Mascot() {
  const [isIdle, setIsIdle] = useState(false);
  const [bubble, setBubble] = useState(null);
  const [mascotIndex, setMascotIndex] = useState(0);
  const idleTimer = useRef(null);
  const bubbleTimer = useRef(null);

  const resetIdleTimer = () => {
    setIsIdle(false);
    setBubble(null);
    clearTimeout(idleTimer.current);
    clearTimeout(bubbleTimer.current);
    idleTimer.current = setTimeout(() => setIsIdle(true), IDLE_THRESHOLD);
  };

  useEffect(() => {
    resetIdleTimer();
    const events = ['mousemove', 'mousedown', 'keydown', 'touchstart'];
    events.forEach((ev) => window.addEventListener(ev, resetIdleTimer));
    return () => {
      events.forEach((ev) => window.removeEventListener(ev, resetIdleTimer));
      clearTimeout(idleTimer.current);
      clearTimeout(bubbleTimer.current);
    };
  }, []);

  useEffect(()=>{
    const switchTimer = setInterval(()=>{
      setMascotIndex((i) => (i+1) % MASCOT_IMAGES.length);
    }, MASCOT_SWITCH_INTERVAL);
    return() => clearInterval(switchTimer);
  }, []);

  const handleClick = () => {
    const msg = MESSAGES[Math.floor(Math.random() * MESSAGES.length)];
    setBubble(msg);
    clearTimeout(bubbleTimer.current);
    bubbleTimer.current = setTimeout(() => setBubble(null), 3500);
  };

  return (
    <div className="mascot-wrap" onClick={handleClick}>
      {bubble && <div className="mascot-bubble">{bubble}</div>}
      <img
        src={MASCOT_IMAGES[mascotIndex]}
        alt="Desktop mascot"
        className={`mascot ${isIdle ? 'idle' : ''}`}
      />
    </div>
  );
}

export default Mascot;