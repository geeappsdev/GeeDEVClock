import React from 'react';
import { Icon } from './Icon';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  onTitleClick?: () => void;
  size?: 'default' | 'fullscreen';
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, onTitleClick, size = 'default' }) => {
  if (!isOpen) return null;

  const isFullscreen = size === 'fullscreen';

  if (isFullscreen) {
    return (
      <div 
        className="fixed inset-0 bg-background z-50 animate-fade-in"
        role="dialog" 
        aria-modal="true" 
        aria-labelledby="modal-title"
      >
        <div className="bg-surface shadow-lg w-full h-full flex flex-col">
          <header className="flex justify-between items-center p-4 border-b border-white/10 flex-shrink-0">
            <h2 id="modal-title" className="text-lg font-semibold" onClick={onTitleClick} style={{ cursor: onTitleClick ? 'pointer' : 'default' }}>{title}</h2>
            <button onClick={onClose} className="p-1 rounded-full hover:bg-white/10" aria-label="Close modal"><Icon name="x" className="w-5 h-5" /></button>
          </header>
          <main className="flex-1 overflow-hidden">
            {children}
          </main>
        </div>
      </div>
    );
  }
  
  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div className="bg-surface rounded-xl shadow-lg w-full max-w-md m-4 animate-slide-in" onClick={e => e.stopPropagation()}>
        <header className="flex justify-between items-center p-4 border-b border-white/10">
          <h2 id="modal-title" className="text-lg font-semibold" onClick={onTitleClick} style={{ cursor: onTitleClick ? 'pointer' : 'default' }}>{title}</h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-white/10" aria-label="Close modal"><Icon name="x" className="w-5 h-5" /></button>
        </header>
        <main className="p-4">
          {children}
        </main>
      </div>
    </div>
  );
};
