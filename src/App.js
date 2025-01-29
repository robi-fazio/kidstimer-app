import React, { useState, useEffect, useRef } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './App.css';

const App = () => {
  const [activeTimer, setActiveTimer] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef(null);
  const audioRef = useRef({
    start: null,
    tick: null,
    end: null
  });

  const timers = [
    { id: 1, name: "Brushing Teeth", duration: 120 },
    { id: 2, name: "Household Chores", duration: 300 },
    { id: 3, name: "Tidying Room", duration: 600 },
  ];

  useEffect(() => {
    audioRef.current = {
      start: new Audio(process.env.PUBLIC_URL + '/sounds/start.mp3'),
      tick: new Audio(process.env.PUBLIC_URL + '/sounds/tick.mp3'),
      end: new Audio(process.env.PUBLIC_URL + '/sounds/end.mp3')
    };

    return () => {
      Object.values(audioRef.current).forEach(sound => {
        if (sound) {
          sound.pause();
          sound.currentTime = 0;
        }
      });
    };
  }, []);

  const startTimer = (timer) => {
    cancelTimer();
    setActiveTimer(timer.id);
    setTimeLeft(timer.duration);
    setIsPaused(false);

    audioRef.current.start.play().catch(console.error);

    intervalRef.current = setInterval(() => {
      setTimeLeft(prev => {
        const newTime = prev - 1;
        if (newTime > 0) audioRef.current.tick.play().catch(console.error);
        if (newTime <= 0) finishTimer(timer);
        return newTime > 0 ? newTime : 0;
      });
    }, 1000);
  };

  const pauseTimer = () => {
    clearInterval(intervalRef.current);
    setIsPaused(true);
  };

  const resumeTimer = () => {
    setIsPaused(false);
    intervalRef.current = setInterval(() => {
      setTimeLeft(prev => {
        const newTime = prev - 1;
        if (newTime > 0) audioRef.current.tick.play().catch(console.error);
        if (newTime <= 0) finishTimer(timers.find(t => t.id === activeTimer));
        return newTime > 0 ? newTime : 0;
      });
    }, 1000);
  };

  const cancelTimer = () => {
    clearInterval(intervalRef.current);
    setActiveTimer(null);
    setTimeLeft(0);
    setIsPaused(false);
    Object.values(audioRef.current).forEach(sound => {
      sound.pause();
      sound.currentTime = 0;
    });
  };

  const finishTimer = (timer) => {
    cancelTimer();
    audioRef.current.end.play().catch(console.error);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 300,
    slidesToShow: 1,
    slidesToScroll: 1,
    centerMode: true,
    centerPadding: "15%",
    cssEase: 'ease-in-out',
    swipe: !activeTimer,
    draggable: !activeTimer,
    touchMove: !activeTimer,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          centerPadding: "5%",
          slidesToShow: 1,
          centerMode: true
        }
      }
    ]
  };

  return (
    <div className="App">
      <h1>Kids Timer App ⏱️</h1>
      
      <div className="carousel-container">
        <Slider {...settings}>
          {timers.map((timer) => (
            <div key={timer.id} className="timer-card">
              <h2>{timer.name}</h2>
              <p className="duration-display">
                {formatTime(activeTimer === timer.id ? timeLeft : timer.duration)}
              </p>

              {activeTimer === timer.id ? (
                <>
                  <div className="progress-bar">
                    <div 
                      className="progress" 
                      style={{ 
                        width: `${(timeLeft / timer.duration) * 100}%`,
                        transition: `width ${isPaused ? '0s' : '1s'} linear`
                      }}
                    />
                  </div>

                  <div className="card-controls">
                    {isPaused ? (
                      <button className="resume-btn" onClick={resumeTimer}>
                        ⏵ Resume
                      </button>
                    ) : (
                      <button className="pause-btn" onClick={pauseTimer}>
                        ⏸ Pause
                      </button>
                    )}
                    <button className="cancel-btn" onClick={cancelTimer}>
                      ⏹ Cancel
                    </button>
                  </div>
                </>
              ) : (
                <button 
                  className="start-btn"
                  onClick={() => startTimer(timer)}
                  disabled={activeTimer !== null}
                >
                  ▶️ Start
                </button>
              )}
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default App;