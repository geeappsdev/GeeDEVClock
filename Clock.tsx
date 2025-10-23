import React, { useState, useEffect } from 'react';

export const Clock: React.FC = () => {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
      const timerId = setInterval(() => setTime(new Date()), 1000);
      return () => clearInterval(timerId);
  }, []);

  return (
      <div className="flex flex-col items-center justify-center p-8 animate-fade-in">
          <div className="font-mono text-6xl md:text-8xl lg:text-9xl font-bold tracking-tighter text-primary">
              {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })}
          </div>
          <div className="mt-2 text-lg md:text-xl text-text-secondary">
              {time.toLocaleDateString([], { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
      </div>
  );
};
