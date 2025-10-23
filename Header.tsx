import React, { useState, useEffect } from 'react';
import { Icon } from './Icon';

const HeaderClock: React.FC = () => {
    const [time, setTime] = useState(new Date());
    useEffect(() => {
        const timerId = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timerId);
    }, []);

    return (
        <div className="text-right hidden sm:block">
            <div className="font-mono text-lg font-semibold text-text-primary tracking-tight">
                {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
            </div>
            <div className="text-xs text-text-secondary">
                {time.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })}
            </div>
        </div>
    );
};


interface HeaderProps {
    onSettingsClick: () => void;
    onChatClick: () => void;
    // FIX: Replaced hasApiKey with aiUnlocked to control visibility of AI features.
    aiUnlocked: boolean;
    showDateTime: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onSettingsClick, onChatClick, aiUnlocked, showDateTime }) => {
  return (
    <header className="flex justify-between items-center p-4 md:p-6 animate-fade-in">
      <h1 className="text-2xl font-bold tracking-tighter text-text-primary">GeeClock AI</h1>
      <div className="flex items-center gap-4">
        {showDateTime && <HeaderClock />}
        <div className="flex items-center gap-2">
          {/* FIX: Chat icon visibility is now controlled by aiUnlocked. */}
          {aiUnlocked && <button onClick={onChatClick} className="p-2 rounded-full hover:bg-surface transition-colors" aria-label="Open Chat"><Icon name="chat" className="w-6 h-6" /></button>}
          <button onClick={onSettingsClick} className="p-2 rounded-full hover:bg-surface transition-colors" aria-label="Open Settings"><Icon name="cog" className="w-6 h-6" /></button>
        </div>
      </div>
    </header>
  );
};
