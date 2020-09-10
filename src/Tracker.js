import React, { useState, useEffect, useCallback } from 'react';
import StopWatch from './StopWatch.js';

const Calculator = () => {

  const [ workStatus, setWorkStatus ] = useState('Not Working');
  const [ clockHours, setClockHours ] = useState('00');
  const [ clockMinutes, setClockMinutes ] = useState('00'); 
  const [ clockSeconds, setClockSeconds ] = useState('00');
  const [ clockIsRunning, setClockIsRunning ] = useState(false);

  const handleStartWork = () => {
    setWorkStatus('Working');
  }

  const handleStopWork = () => {
    setWorkStatus('Not Working');
  }

  const handleClearTime = () => {
    if(workStatus === 'Not Working'){
      setClockHours('00');
      setClockMinutes('00');
      setClockSeconds('00');
    }
  }

  const refactorTime = useCallback(() => {
    let minutes = 0;
    let hours = 0;

    if(+clockSeconds >= 60){
      minutes = Math.floor(+clockSeconds / 60);
      setClockSeconds((+clockSeconds % 60).toString());
      setClockMinutes((+clockMinutes + minutes).toString());
    }

    if(+clockMinutes >= 60){
      hours = Math.floor(+clockMinutes / 60);
      setClockMinutes((+clockMinutes % 60).toString());
      setClockHours((+clockHours + hours).toString());
    }
  }, [clockSeconds, clockMinutes, clockHours]);

  useEffect(() => {
    refactorTime();
    const clock = (workStatus === 'Working') && setTimeout(() => setClockSeconds((+clockSeconds + 1).toString()), 1000); 

    return () => clearInterval(clock)
  }, [workStatus, clockSeconds, refactorTime]);

  return (
    <div className="Tracker">
      <h1 className="Tracker-title">Time Tracker</h1>
      <div className="Tracker-btn-container">
        <div className="Tracker-row">
          <p className="Tracker-text">Current Status:</p>
          <p className="Tracker-text">{workStatus}</p>
        </div>
        <div className="Tracker-row">
          <p className="Tracker-text">Time Worked:</p>
          <StopWatch className="Tracker-text" hours={clockHours} minutes={clockMinutes} seconds={clockSeconds}/>
        </div>
        <div className="Tracker-row">
          <button onClick={handleStartWork} className="Tracker-btn">START WORK</button>
          <button onClick={handleStopWork} className="Tracker-btn">END WORK</button>
        </div>
        <div className="Tracker-row">
          <button onClick={handleClearTime} className="Tracker-btn">CLEAR TIME</button>
          <button className="Tracker-btn">SUBMIT TIME</button>
        </div>
      </div>
    </div>
  );
}

export default Calculator;