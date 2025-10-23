import React, { useState, useEffect, useRef } from 'react';
import type { Chat } from '@google/genai';
import { Modal } from './Modal';
import { Icon } from './Icon';
import { TimerDisplay } from './TimerDisplay';
import type { ChatMessage, Timer as TimerType, GroundingSource } from '../types';
import { createChatSession } from '../services/geminiService';
import { useLocalStorage } from '../hooks/useLocalStorage';


interface ChatBotProps {
    isOpen: boolean;
    onClose: () => void;
    useSearch: boolean;
    timers?: TimerType[];
}

export const ChatBot: React.FC<ChatBotProps> = ({ isOpen, onClose, useSearch, timers = [] }) => {
    const [messages, setMessages] = useLocalStorage<ChatMessage[]>('geeclock-chat-history', []);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const chatRef = useRef<Chat | null>(null);
    
    const runningTimers = timers.filter(t => t.isRunning);

    useEffect(() => {
      if (isOpen) {
        if (messages.length === 0) {
            setMessages([{ 
                id: crypto.randomUUID(),
                role: 'model', 
                text: 'Hello! How can I help you today?' 
            }]);
        }
        // Create a new session with the persisted history every time the modal opens
        chatRef.current = createChatSession(useSearch, messages);
      }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen, useSearch]);
    
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };
    
    useEffect(scrollToBottom, [messages]);
    
    const handleSend = async () => {
        if (!input.trim() || isLoading || !chatRef.current) return;
        
        const userInput = input;
        const userMessage: ChatMessage = {
            id: crypto.randomUUID(),
            role: 'user',
            text: userInput,
        };

        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const result = await chatRef.current.sendMessage({ message: userInput });

            const sources = result.candidates?.[0]?.groundingMetadata?.groundingChunks
                ?.map((chunk: any) => chunk.web)
                .filter(Boolean) as GroundingSource[] | undefined;
            
            const modelMessage: ChatMessage = {
                id: crypto.randomUUID(),
                role: 'model',
                text: result.text,
                sources,
            };
            setMessages(prev => [...prev, modelMessage]);
        } catch (error) {
            console.error("Error sending message:", error);
            const errorMessage: ChatMessage = {
                id: crypto.randomUUID(),
                role: 'model',
                text: 'Sorry, I encountered an error. Check the console for details.'
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleRateMessage = (id: string, rating: 'good' | 'bad') => {
        setMessages(prevMessages =>
            prevMessages.map(msg =>
                msg.id === id
                ? { ...msg, rating: msg.rating === rating ? undefined : rating } // Toggle rating on/off
                : msg
            )
        );
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="GeeClock AI Assistant" size="fullscreen">
            <div className="flex flex-col h-full">
                {runningTimers.length > 0 && (
                    <div className="p-2 border-b border-white/10 bg-background/50">
                        <div className="flex items-center gap-4 flex-wrap justify-center">
                            {runningTimers.map(timer => (
                                <TimerDisplay key={timer.id} timer={timer} />
                            ))}
                        </div>
                    </div>
                )}
                <div className="flex-1 overflow-y-auto space-y-4 p-4">
                    {messages.map((msg) => (
                        <div key={msg.id} className={`flex items-end gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-xs md:max-w-md lg:max-w-2xl p-3 rounded-lg ${msg.role === 'user' ? 'bg-primary text-white' : 'bg-background'}`}>
                                <div className="whitespace-pre-wrap">{msg.text}</div>
                                {msg.sources && msg.sources.length > 0 && (
                                    <div className="mt-2 pt-2 border-t border-text-secondary/20 text-xs text-text-secondary">
                                        <h4 className="font-semibold mb-1">Sources:</h4>
                                        <ul className="space-y-1">
                                            {msg.sources.map((source, i) => (
                                                <li key={i} className="truncate">
                                                    <a href={source.uri} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                                                        {source.title || source.uri}
                                                    </a>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                             {msg.role === 'model' && msg.text && !msg.text.startsWith('Sorry, I encountered an error') && (
                                <div className="flex items-center gap-1">
                                    <button onClick={() => handleRateMessage(msg.id, 'good')} className={`p-1.5 rounded-full transition-colors ${msg.rating === 'good' ? 'bg-primary/20 text-primary' : 'text-text-secondary hover:bg-surface'}`} aria-label="Good response">
                                        <Icon name="thumb-up" className="w-4 h-4" />
                                    </button>
                                    <button onClick={() => handleRateMessage(msg.id, 'bad')} className={`p-1.5 rounded-full transition-colors ${msg.rating === 'bad' ? 'bg-red-500/20 text-red-500' : 'text-text-secondary hover:bg-surface'}`} aria-label="Bad response">
                                        <Icon name="thumb-down" className="w-4 h-4" />
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                    {isLoading && (
                      <div className="flex justify-start">
                          <div className="p-3 rounded-lg bg-background">
                              <div className="flex items-center gap-2">
                                  <span className="h-2 w-2 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                  <span className="h-2 w-2 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                  <span className="h-2 w-2 bg-primary rounded-full animate-bounce"></span>
                              </div>
                          </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
                <div className="p-4 border-t border-white/10">
                  <div className="flex gap-2">
                      <input 
                        type="text" 
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        onKeyPress={e => e.key === 'Enter' && handleSend()}
                        placeholder="Ask anything..."
                        className="flex-1 p-2 rounded-md bg-background border border-surface focus:ring-2 focus:ring-primary outline-none"
                        disabled={isLoading || !chatRef.current}
                      />
                      <button onClick={handleSend} disabled={isLoading || !input.trim() || !chatRef.current} className="p-2 bg-primary text-white rounded-md hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity">
                        <Icon name="send" className="w-5 h-5"/>
                      </button>
                  </div>
                </div>
            </div>
        </Modal>
    );
};