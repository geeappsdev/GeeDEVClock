import React, { useState } from 'react';
import { Modal } from './Modal';
import { THEMES, ALARM_SOUNDS } from '../constants';
import type { Settings } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: Settings;
  onSettingsChange: (settings: Settings) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, settings, onSettingsChange }) => {
  const [titleClickCount, setTitleClickCount] = useState(0);

  const handleTitleClick = () => {
    if (settings.aiUnlocked) return;
    const newCount = titleClickCount + 1;
    setTitleClickCount(newCount);
    if (newCount >= 5) {
      onSettingsChange({ ...settings, aiUnlocked: true });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Settings" onTitleClick={handleTitleClick}>
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-text-secondary">Theme</label>
          <div className="grid grid-cols-3 gap-2 mt-2">
            {Object.keys(THEMES).map(themeKey => (
              <button key={themeKey} onClick={() => onSettingsChange({...settings, theme: themeKey })} className={`p-2 rounded-md text-sm capitalize border-2 ${settings.theme === themeKey ? 'border-primary' : 'border-surface'}`}>
                {themeKey}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-text-secondary">Appearance</label>
          <div className="mt-2 flex rounded-md bg-background p-1">
              <button onClick={() => onSettingsChange({...settings, darkMode: false})} className={`flex-1 p-1.5 rounded text-sm ${!settings.darkMode ? 'bg-surface shadow' : ''}`}>Light</button>
              <button onClick={() => onSettingsChange({...settings, darkMode: true})} className={`flex-1 p-1.5 rounded text-sm ${settings.darkMode ? 'bg-surface shadow' : ''}`}>Dark</button>
          </div>
        </div>
         <div className="flex items-center justify-between">
            <label htmlFor="show-datetime" className="text-sm font-medium text-text-secondary">
                Show Time in Header
                <p className="text-xs text-text-secondary/70">Display time and date in the header.</p>
            </label>
            <button
                id="show-datetime"
                role="switch"
                aria-checked={settings.showDateTimeInHeader}
                onClick={() => onSettingsChange({...settings, showDateTimeInHeader: !settings.showDateTimeInHeader})}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-surface ${settings.showDateTimeInHeader ? 'bg-primary' : 'bg-gray-600'}`}
            >
                <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${settings.showDateTimeInHeader ? 'translate-x-5' : 'translate-x-0'}`} />
            </button>
        </div>
         <div>
          <label className="block text-sm font-medium text-text-secondary">Alarm Sound</label>
          <select
            value={settings.alarmSound}
            onChange={e => onSettingsChange({ ...settings, alarmSound: e.target.value, customAlarmSoundUrl: e.target.value === 'custom' ? settings.customAlarmSoundUrl : '' })}
            className="mt-1 w-full p-2 rounded-md bg-background border border-surface focus:ring-2 focus:ring-primary outline-none"
            aria-label="Select alarm sound"
          >
            {Object.entries(ALARM_SOUNDS).map(([key, { name }]) => (
              <option key={key} value={key}>{name}</option>
            ))}
            <option value="custom">Custom URL</option>
          </select>
        </div>
        {settings.alarmSound === 'custom' && (
          <div className="animate-fade-in">
            <label htmlFor="custom-alarm-url" className="block text-sm font-medium text-text-secondary">Custom Sound URL</label>
            <input
              type="url"
              id="custom-alarm-url"
              value={settings.customAlarmSoundUrl}
              onChange={e => onSettingsChange({ ...settings, customAlarmSoundUrl: e.target.value })}
              placeholder="https://example.com/sound.mp3"
              className="mt-1 w-full p-2 rounded-md bg-background border border-surface focus:ring-2 focus:ring-primary outline-none"
            />
          </div>
        )}

        {/* FIX: Removed API Key input and related logic to adhere to security guidelines. */}
        {settings.aiUnlocked && (
          <div className="pt-4 mt-4 border-t border-surface">
            <h3 className="text-md font-semibold text-text-primary">AI Assistant</h3>
             <p className="text-xs text-text-secondary/70 mb-4">Click the modal title 5 times to hide this section.</p>
            
            <div className="mt-4 flex items-center justify-between">
                <label htmlFor="use-search" className="text-sm font-medium text-text-secondary">
                    Enable Google Search
                    <p className="text-xs text-text-secondary/70">Allow AI to access up-to-date information.</p>
                </label>
                <button
                    id="use-search"
                    role="switch"
                    aria-checked={settings.useSearch}
                    onClick={() => onSettingsChange({...settings, useSearch: !settings.useSearch})}
                    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-surface ${settings.useSearch ? 'bg-primary' : 'bg-gray-600'}`}
                >
                    <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${settings.useSearch ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};
