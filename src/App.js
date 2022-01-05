import { useState, useEffect } from 'react';
import { Notify } from 'notiflix';
import { CSSTransition } from 'react-transition-group';
import './App.css';

function App() {
  const [buttonText, setButtonText] = useState('Start');
  const [time, setTime] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isDisabled, setIsDisabled] = useState(true);
  const [isWaitClicked, setIsWaitClicked] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    let interval = null;

    if (isActive && !isPaused) {
      interval = setInterval(() => {
        setTime(time => time + 10);
      }, 10);
      setIsDisabled(false);
    } else {
      clearInterval(interval);
      setIsDisabled(true);
    }
    return () => {
      clearInterval(interval);
    };
  }, [isActive, isPaused]);

  function startTimer() {
    if (!isActive && !isPaused) {
      setIsActive(true);
      setButtonText('Stop');
      Notify.info('You started timer');
    } else if (isPaused && !isActive) {
      setIsActive(true);
      setIsPaused(false);
      setButtonText('Stop');
      Notify.info('You continued timer');
    } else {
      setIsActive(false);
      setButtonText('Start');
      setTime(0);
      Notify.failure('You stopped timer');
    }
  }

  function pauseTimer() {
    let timeForSecondClick = null;
    timeForSecondClick = setTimeout(() => {
      setIsWaitClicked(0);
    }, 300);

    if (isWaitClicked === 1) {
      setButtonText('Continue');
      setIsPaused(true);
      setIsActive(false);
      Notify.warning('You paused timer');
      setIsWaitClicked(0);
      clearTimeout(timeForSecondClick);
    }
  }

  function resetTimer() {
    setTime(0);
    setIsActive(false);
    setIsActive(true);
    Notify.failure('You reset timer');
  }

  return (
    <div className="App">
      <CSSTransition
        timeout={500}
        classNames="animation"
        appear={true}
        in={true}
      >
        <h1>Stopwatch</h1>
      </CSSTransition>

      <div className="stopwatch">
        <div className="hours digits-block">
          {('0' + Math.floor(time / 3600000000)).slice(-2)}:
        </div>
        <div className="minutes digits-block">
          {('0' + Math.floor((time / 60000) % 60)).slice(-2)}:
        </div>
        <div className="seconds digits-block">
          {('0' + Math.floor((time / 1000) % 60)).slice(-2)}
        </div>
      </div>
      <div className="buttons-block">
        <button className="button button-start" onClick={startTimer}>
          {buttonText}
        </button>
        <button
          className="button button-wait"
          onClick={() => {
            setIsWaitClicked(isWaitClicked => isWaitClicked + 1);
            pauseTimer();
          }}
          disabled={isDisabled}
        >
          Wait
        </button>
        <button
          className="button button-reset"
          onClick={resetTimer}
          disabled={isDisabled}
        >
          Reset
        </button>
      </div>
    </div>
  );
}

export default App;

Notify.init({
  fontSize: '20px',
});
