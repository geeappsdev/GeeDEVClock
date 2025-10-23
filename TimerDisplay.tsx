import React, { useState, useEffect } from 'react';
import { useInterval } from '../hooks/useInterval';
import type { Timer as TimerType } from '../types';
import { Icon } from './Icon';

const formatTime = (seconds: number): string => {
    const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
    const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
};

interface TimerDisplayProps {
    timer: TimerType;
}

export const TimerDisplay: React.FC<TimerDisplayProps> = ({ timer }) => {
    const [remaining, setRemaining] = useState(timer.remaining);

    useEffect(() => {
        setRemaining(timer.remaining);
    }, [timer.remaining, timer.isRunning]);

    useInterval(() => {
        if (timer.isRunning && timer.startTime) {
            const elapsed = (Date.now() - timer.startTime) / 1000;
            const newRemaining = timer.duration - elapsed;
            setRemaining(Math.max(0, newRemaining));
        }
    }, 1000);

    return (
        <div className="flex items-center gap-2 text-text-secondary animate-fade-in">
            <Icon name="timer" className="w-4 h-4 text-secondary" />
            <span className="font-semibold text-text-primary text-xs">{timer.label}:</span>
            <span className="font-mono tracking-tight text-xs">{formatTime(Math.max(0, Math.round(remaining)))}</span>
        </div>
    );
};
