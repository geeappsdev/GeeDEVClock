import React, { useState } from 'react';
import { Modal } from './Modal';
import { Icon } from './Icon';
import { getTimerSuggestion } from '../services/geminiService';

interface AddTimerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTimer: (timer: { label: string; duration: number }) => void;
}

// FIX: Removed apiKey prop as it's no longer needed by geminiService.
export const AddTimerModal: React.FC<AddTimerModalProps> = ({ isOpen, onClose, onAddTimer }) => {
    const [label, setLabel] = useState('');
    const [hours, setHours] = useState(0);
    const [minutes, setMinutes] = useState(5);
    const [seconds, setSeconds] = useState(0);
    const [aiPrompt, setAiPrompt] = useState('');
    const [isAiLoading, setIsAiLoading] = useState(false);
    const [aiError, setAiError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const duration = (hours * 3600) + (minutes * 60) + seconds;
        if (duration > 0) {
            onAddTimer({ label: label || 'New Timer', duration });
            setLabel('');
            setHours(0);
            setMinutes(5);
            setSeconds(0);
            setAiPrompt('');
            onClose();
        }
    };

    const handleAiSuggest = async () => {
        // FIX: Removed apiKey check.
        if (!aiPrompt.trim()) return;
        setIsAiLoading(true);
        setAiError('');
        try {
            // FIX: Removed apiKey from getTimerSuggestion call.
            const suggestion = await getTimerSuggestion(aiPrompt);
            setLabel(suggestion.label);
            const h = Math.floor(suggestion.duration / 3600);
            const m = Math.floor((suggestion.duration % 3600) / 60);
            const s = suggestion.duration % 60;
            setHours(h);
            setMinutes(m);
            setSeconds(s);
        } catch (error) {
            console.error("AI Suggestion failed:", error);
            setAiError('Could not get suggestion. Please try again.');
        } finally {
            setIsAiLoading(false);
        }
    };
    
    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Add New Timer">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-text-secondary">Get suggestion from AI</label>
                    <div className="relative flex items-center">
                        <input
                          type="text"
                          value={aiPrompt}
                          onChange={e => setAiPrompt(e.target.value)}
                          onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleAiSuggest())}
                          placeholder="e.g., Bake a pizza"
                          className="w-full p-2 pr-10 rounded-md bg-background border border-surface focus:ring-2 focus:ring-primary outline-none"
                        />
                        <button type="button" onClick={handleAiSuggest} disabled={isAiLoading || !aiPrompt.trim()} className="absolute right-1 p-1.5 text-primary rounded-full hover:bg-surface disabled:opacity-50 disabled:cursor-not-allowed">
                            {isAiLoading ? (
                                <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                                <Icon name="sparkles" className="w-5 h-5" />
                            )}
                        </button>
                    </div>
                     {aiError && <p className="text-red-400 text-xs mt-1">{aiError}</p>}
                </div>

                <div className="pt-4 border-t border-surface">
                    <label htmlFor="label" className="block text-sm font-medium text-text-secondary">Label</label>
                    <input type="text" id="label" value={label} onChange={e => setLabel(e.target.value)} placeholder="e.g., Cooking Pasta" className="mt-1 w-full p-2 rounded-md bg-background border border-surface focus:ring-2 focus:ring-primary outline-none" />
                </div>
                <div className="flex gap-2">
                    <div className="flex-1">
                        <label htmlFor="hours" className="block text-sm font-medium text-text-secondary">Hours</label>
                        <input type="number" id="hours" value={hours} onChange={e => setHours(parseInt(e.target.value, 10))} min="0" max="99" className="mt-1 w-full p-2 rounded-md bg-background border border-surface focus:ring-2 focus:ring-primary outline-none" />
                    </div>
                    <div className="flex-1">
                        <label htmlFor="minutes" className="block text-sm font-medium text-text-secondary">Minutes</label>
                        <input type="number" id="minutes" value={minutes} onChange={e => setMinutes(parseInt(e.target.value, 10))} min="0" max="59" className="mt-1 w-full p-2 rounded-md bg-background border border-surface focus:ring-2 focus:ring-primary outline-none" />
                    </div>
                    <div className="flex-1">
                        <label htmlFor="seconds" className="block text-sm font-medium text-text-secondary">Seconds</label>
                        <input type="number" id="seconds" value={seconds} onChange={e => setSeconds(parseInt(e.target.value, 10))} min="0" max="59" className="mt-1 w-full p-2 rounded-md bg-background border border-surface focus:ring-2 focus:ring-primary outline-none" />
                    </div>
                </div>
                <button type="submit" className="w-full p-2 bg-primary text-white font-semibold rounded-md hover:opacity-90 transition-opacity">Add Timer</button>
            </form>
        </Modal>
    );
};
