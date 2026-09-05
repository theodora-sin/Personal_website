import {useState, useEffect} from 'react';
function Clock(){
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return() => clearInterval(timer);
    }, []);
    return(
        <div className="clock-widget">
            <div className="time">{time.toLocaleTimeString()}</div>
            <div className="date">{time.toLocaleDateString(undefined, {weekday: 'long', month:'long', day: 'numeric' })}</div>
        </div>
    )
}
export default Clock;