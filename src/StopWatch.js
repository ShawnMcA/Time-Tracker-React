import React from 'react';

const StopWatch = props => {
  return (
  <p>{props.hours}:{props.minutes}:{props.seconds}</p>
  );
}

export default StopWatch;