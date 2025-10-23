import React from 'react';
import type { Timer as TimerType } from '../types';
import { Timer } from './Timer';
import { Icon } from './Icon';

interface TimerListProps {
    timers: TimerType[];
    onAdd: () => void;
    onDelete: (id: number) => void;
    onToggle: (id: number) => void;
    onReset: (id: number) => void;
    alarmSoundUrl: string;
}

export const TimerList: React.FC<TimerListProps> = ({ timers, onAdd, onDelete, onToggle, onReset, alarmSoundUrl }) => {
    return (
        <div className="p-4 md:p-6 space-y-4 animate-fade-in">
            {timers.length === 0 ? (
                <div className="text-center py-16 text-text-secondary">
                    <p>No timers yet.</p>
                    <button onClick={onAdd} className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg font-semibold hover:opacity-90 transition-opacity">
                        <Icon name="plus" className="w-5 h-5" />
                        Add Timer
                    </button>
                </div>
            ) : (
                timers.map(timer => (
                    <Timer key={timer.id} timer={timer} onDelete={onDelete} onToggle={onToggle} onReset={onReset} alarmSoundUrl={alarmSoundUrl} />
                ))
            )}
        </div>
    );
};
