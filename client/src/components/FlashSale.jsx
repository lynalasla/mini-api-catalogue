import { useState, useEffect } from 'react';
import './FlashSale.css';

function FlashSale() {
  const [time, setTime] = useState({ hours: 8, minutes: 17, seconds: 56 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(prev => {
        let { hours, minutes, seconds } = prev;
        
        if (seconds > 0) {
          seconds--;
        } else if (minutes > 0) {
          minutes--;
          seconds = 59;
        } else if (hours > 0) {
          hours--;
          minutes = 59;
          seconds = 59;
        } else {
          clearInterval(timer);
        }
        
        return { hours, minutes, seconds };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (num) => String(num).padStart(2, '0');

  return (
    <div className="flash-sale-container">
      <div className="flash-sale">
        <div className="flash-sale-header">
          <div className="flash-title">
            <span className="flash-icon">⚡</span>
            <h2>Flash Sale</h2>
          </div>
          <div className="flash-timer">
            <span className="timer-label">Ends in:</span>
            <div className="timer">
              <div className="time-box">{formatTime(time.hours)}</div>
              <span className="timer-sep">:</span>
              <div className="time-box">{formatTime(time.minutes)}</div>
              <span className="timer-sep">:</span>
              <div className="time-box">{formatTime(time.seconds)}</div>
            </div>
          </div>
          <div className="flash-nav">
            <button className="nav-arrow">‹</button>
            <button className="nav-arrow">›</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FlashSale;
