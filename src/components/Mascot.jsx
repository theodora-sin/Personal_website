import { useState, useEffect, useRef } from 'react';

const IDLE_THRESHOLD = 15000;
const MASCOT_SWITCH_INTERVAL = 30000; /*30 seconds*/
const MASCOT_IMAGES= ['./Mascot.png', './mascot1.png']
const MESSAGES = [
  "Just chilling here~",
  "Don't forget to check your to-do list!",
  "It's a good time for a break ",
  "Let your interest take over curriculum",
  "Make your dream comes true!"
];/*messages*/

function Mascot() {
  const [isIdle, setIsIdle] = useState(false);
  const [bubble, setBubble] = useState(null);
  const [mascotIndex, setMascotIndex] = useState(0);
  const idleTimer = useRef(null);
  const bubbleTimer = useRef(null);

  /*30 seconds timer*/
  const reset = () => {
    setIsIdle(false);
    setBubble(null);
    clearTimeout(idleTimer.current);
    clearTimeout(bubbleTimer.current);
    idleTimer.current = setTimeout(() => setIsIdle(true), IDLE_THRESHOLD);
  };

  useEffect(() => {
    reset();
    const events = ['mousemove', 'mousedown', 'keydown', 'touchstart'];
    events.forEach((ev) => window.addEventListener(ev, reset));
    return () => {
      events.forEach((ev) => window.removeEventListener(ev, reset));
      clearTimeout(idleTimer.current);
      clearTimeout(bubbleTimer.current);
    };
  }, []);
  /*switch mascot*/
  useEffect(()=>{
    const switchTimer = setInterval(()=>{
      setMascotIndex((i) => (i+1) % MASCOT_IMAGES.length);
    }, MASCOT_SWITCH_INTERVAL);
    return() => clearInterval(switchTimer);
  }, []);
  /*click mascot*/
  const Click = () => {
    const msg = MESSAGES[Math.floor(Math.random() * MESSAGES.length)];
    setBubble(msg);
    clearTimeout(bubbleTimer.current);
    bubbleTimer.current = setTimeout(() => setBubble(null), 3500);
  };

  return (
    <div className="mascot-wrap" onClick={Click}>
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