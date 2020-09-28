import React, { useState, useEffect, useCallback } from 'react';
import StopWatch from './StopWatch.js';

const Tracker = () => {

  const [ workStatus, setWorkStatus ] = useState('Not Working');
  const [ clockHours, setClockHours ] = useState('00');
  const [ clockMinutes, setClockMinutes ] = useState('00'); 
  const [ clockSeconds, setClockSeconds ] = useState('00');
  const [ totalTime, setTotalTime ] = useState('00:00:00');
  const [ totalTimeVisible, setTotalTimeVisible ] = useState(false);

  // start work button
  const handleStartWork = () => {
    setWorkStatus('Working');
  }

  // stop work button
  const handleStopWork = () => {
    setWorkStatus('Not Working');
  }

  // clear time button
  const handleClearTime = () => {
    if(workStatus === 'Not Working'){
      setClockHours('00');
      setClockMinutes('00');
      setClockSeconds('00');
    }
  }

  // submit time button
  const handleSubmitTime = () => {
    if(workStatus === 'Not Working') {
      let prevTime = getPrevTimeWorked();
      let prevTimeArray = prevTime.split(':');
      let newTime;
      let newTimeRefactored;
      let totalTime;

      // adds localstorage time with new time
      newTime = [addTimes(prevTimeArray[0], clockHours), addTimes(prevTimeArray[1], clockMinutes), addTimes(prevTimeArray[2], clockSeconds)];

      newTimeRefactored = refactorTotalTime(newTime);

      totalTime = newTimeRefactored[0] + ':' + newTimeRefactored[1] + ':' + newTimeRefactored[2];

      localStorage.setItem('totalTimeWorked', totalTime);
      setTotalTime(totalTime);
      setTotalTimeVisible(true);
      handleClearTime();
    }
  }

  // get local storage time
  const getPrevTimeWorked = () => {
    if('totalTimeWorked' in localStorage){
      return localStorage.getItem('totalTimeWorked');
    } else {
      return '00:00:00';
    }
  };

  // adds local storage time with new time
  const addTimes = (prevTime, newTime) => {
    return (+prevTime + +newTime).toString();
  }

  // refactors total time
  const refactorTotalTime = timeArray => {
    if(+timeArray[2] >= 60) {
      timeArray[1] += Math.floor(+timeArray[2] / 60);
      timeArray[2] = (+timeArray[2] % 60).toString();
    }

    if(+timeArray[1] >= 60) {
      timeArray[0] += Math.floor(+timeArray[1] / 60);
      timeArray[1] = (+timeArray[1] % 60).toString();
    }

    if(timeArray[2].length === 1) timeArray[2] = ('0' + timeArray[2]);
    if(timeArray[1].length === 1) timeArray[1] = ('0' + timeArray[1]);
    if(timeArray[0].length === 1) timeArray[0] = ('0' + timeArray[0]);

    return timeArray;
  }

  // refactors stop watch time
  const refactorTime = useCallback(() => {
    let hours = 0;
    let minutes = 0;

    if(clockSeconds.length === 1) setClockSeconds('0' + clockSeconds);
    if(clockMinutes.length === 1) setClockMinutes('0' + clockMinutes);
    if(clockHours.length === 1) setClockHours('0' + clockHours);

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

    return () => clearInterval(clock);
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
          <button onClick={handleSubmitTime} className="Tracker-btn">SUBMIT TIME</button>
        </div>
        <div className={totalTimeVisible? "Tracker-row" : "Tracker-row hidden"}>
          <p className="Tracker-text">Total Time Worked: </p>
          <p className="Tracker-text">{totalTime}</p>
        </div>
      </div>
    </div>
  );
}

export default Tracker;