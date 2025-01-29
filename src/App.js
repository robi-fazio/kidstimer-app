import React, { useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./App.css";

const App = () => {
  const [selectedTimer, setSelectedTimer] = useState(null);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  // Timer options for the carousel
  const timers = [
    { id: 1, name: "Brushing Teeth", duration: 120 }, // 2 minutes
    { id: 2, name: "Household Chores", duration: 300 }, // 5 minutes
    { id: 3, name: "Tidying Room", duration: 600 }, // 10 minutes
  ];

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

  // Start the timer
  const startTimer = (duration) => {
    setIsTimerRunning(true);
    setTimeout(() => {
      setIsTimerRunning(false);
      alert("Time's up!"); // Replace this with your animation placeholder
    }, duration * 1000);
  };

  return (
    <div className="App">
      <h1>Kids Timer App</h1>

      {/* Carousel for timer selection */}
      <div className="carousel-container">
        <Slider {...settings}>
          {timers.map((timer) => (
            <div key={timer.id} className="timer-card">
              <h2>{timer.name}</h2>
              <p>{timer.duration} seconds</p>
              <button onClick={() => startTimer(timer.duration)}>Start Timer</button>
            </div>
          ))}
        </Slider>
      </div>

      {/* Placeholder for animation when timer starts */}
      {isTimerRunning && (
        <div className="animation-placeholder">
          <p>Timer is running...</p>
          {/* Insert your animation here */}
        </div>
      )}

      {/* Placeholder for animation when timer ends */}
      {!isTimerRunning && selectedTimer && (
        <div className="animation-placeholder">
          <p>Timer ended!</p>
          {/* Insert your animation here */}
        </div>
      )}

      {/* Space for other content */}
      <div className="content">
        <h2>Other Content</h2>
        <p>Add more content here for your landing page.</p>
      </div>
    </div>
  );
};

export default App;