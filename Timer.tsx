import React, { useState, useEffect, useRef } from 'react';
import { useInterval } from '../hooks/useInterval';
import type { Timer as TimerType } from '../types';
import { Icon } from './Icon';

const formatTime = (seconds: number): string => {
    const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
    const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
};

interface TimerProps {
    timer: TimerType;
    onDelete: (id: number) => void;
    onToggle: (id: number) => void;
    onReset: (id: number) => void;
    alarmSoundUrl: string;
}

export const Timer: React.FC<TimerProps> = ({ timer, onDelete, onToggle, onReset, alarmSoundUrl }) => {
    const [remaining, setRemaining] = useState(timer.remaining);
    const audioRef = useRef<HTMLAudioElement>(null);

    useEffect(() => {
        setRemaining(timer.remaining);
    }, [timer.remaining]);

    useInterval(() => {
        if (timer.isRunning && timer.startTime) {
            const elapsed = (Date.now() - timer.startTime) / 1000;
            const newRemaining = timer.duration - elapsed;
            setRemaining(Math.max(0, newRemaining));

            if (newRemaining <= 0) {
                if (audioRef.current) audioRef.current.play();
                onToggle(timer.id);
            }
        }
    }, 1000);
    
    const progress = ((timer.duration - remaining) / timer.duration) * 100;

    return (
       <div className="bg-surface rounded-lg p-4 flex flex-col gap-4 relative overflow-hidden animate-fade-in">
          <div className="absolute top-0 left-0 h-full bg-primary/10" style={{ width: `${progress}%`, transition: 'width 1s linear' }} />
          
          <div className="relative z-10 flex justify-between items-center">
              <span className="font-semibold text-text-primary">{timer.label}</span>
              <div className="flex items-center">
                <button onClick={() => onToggle(timer.id)} className="p-2 rounded-full hover:bg-text-secondary/20 transition-colors" aria-label={timer.isRunning ? 'Pause timer' : 'Start timer'}>
                    <Icon name={timer.isRunning ? 'pause' : 'play'} className="w-5 h-5 text-primary" />
                </button>
                <button onClick={() => onReset(timer.id)} className="p-2 rounded-full hover:bg-text-secondary/10 text-text-secondary transition-colors" aria-label="Reset timer">
                    <Icon name="reset" className="w-5 h-5" />
                </button>
                <button onClick={() => onDelete(timer.id)} className="p-2 rounded-full hover:bg-text-secondary/10 text-text-secondary transition-colors" aria-label="Delete timer">
                    <Icon name="trash" className="w-5 h-5" />
                </button>
              </div>
          </div>

          <div className="relative z-10 text-center py-4">
               <span className="font-mono text-6xl font-bold text-primary tracking-tight">{formatTime(Math.max(0, Math.round(remaining)))}</span>
          </div>
          
          <audio ref={audioRef} src={alarmSoundUrl} preload="auto" />
      </div>
    );
};
