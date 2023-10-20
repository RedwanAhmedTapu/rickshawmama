import  { useState, useEffect } from 'react';

function CountdownTimer() {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    let timerId;

    if (seconds < 300) {
      timerId = setInterval(() => {
        setSeconds((prevSeconds) => prevSeconds + 1);
      }, 1000);
    } else {
      clearInterval(timerId);
    }

    return () => {
      clearInterval(timerId);
    };
  }, [seconds]);

  return (
    <div className='text-center text-3xl text-white font-bold'>
      
      <p>{Math.floor(seconds / 60)}:{(seconds % 60).toLocaleString('en-US', { minimumIntegerDigits: 2 })}</p>
      {seconds >= 300 && <p>Timer has reached 5 minutes (300 seconds).</p>}
    </div>
  );
}

export default CountdownTimer;
