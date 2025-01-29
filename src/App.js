import React, { useState, useEffect, useRef } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./App.css";

const App = () => {
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [selectedTimer, setSelectedTimer] = useState(null);
  const intervalRef = useRef();
  const audioRef = useRef({
    start: new Audio(process.env.PUBLIC_URL + "/sounds/start.mp3"),
    tick: new Audio(process.env.PUBLIC_URL + "/sounds/tick.mp3"),
    end: new Audio(process.env.PUBLIC_URL + "/sounds/end.mp3")
  });

  const timers = [
    { id: 1, name: "Brushing Teeth", duration: 120 },
    { id: 2, name: "Household Chores", duration: 300 },
    { id: 3, name: "Tidying Room", duration: 600 },
  ];

  // Timer logic
  const startTimer = (duration) => {
    // Reset state
    setIsTimerRunning(true);
    setTimeLeft(duration);
    
    // Play start sound
    audioRef.current.start.play().catch(error => {
      console.log("Audio play failed:", error);
    });

    intervalRef.current = setInterval(() => {
      setTimeLeft((prevTime) => {
        const newTime = prevTime - 1;
        
        if (newTime <= 0) {
          clearInterval(intervalRef.current);
          setIsTimerRunning(false);
          audioRef.current.end.play();
          return 0;
        }

        // Play tick sound every second
        if (newTime < duration) {
          audioRef.current.tick.play().catch(error => {
            console.log("Tick sound failed:", error);
          });
        }
        
        return newTime;
      });
    }, 1000);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearInterval(intervalRef.current);
      Object.values(audioRef.current).forEach(sound => {
        sound.pause();
        sound.currentTime = 0;
      });
    };
  }, []);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Carousel settings
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    centerMode: true,
    centerPadding: "0",
  };

  return (
    <div className="App">
      <h1>Kids Timer App ⏱️</h1>

      <div className="carousel-container">
        <Slider {...settings}>
          {timers.map((timer) => (
            <div key={timer.id} className="timer-card">
              <h2>{timer.name}</h2>
              <p>{formatTime(timer.duration)}</p>
              <button 
                onClick={() => startTimer(timer.duration)}
                disabled={isTimerRunning}
              >
                {isTimerRunning ? "⏳ Running..." : "▶️ Start"}
              </button>
            </div>
          ))}
        </Slider>
      </div>

      {isTimerRunning && (
        <div className="timer-display">
          <h2>Time Remaining: {formatTime(timeLeft)}</h2>
        </div>
      )}
    </div>
  );
};

export default App;