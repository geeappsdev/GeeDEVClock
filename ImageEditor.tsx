import React, { useState, useRef } from 'react';
import { Icon } from './Icon';
import { editImage } from '../services/geminiService';

interface ImageEditorProps {
    // FIX: Removed apiKey prop as it is no longer required by the service.
}

export const ImageEditor: React.FC<ImageEditorProps> = () => {
    const [originalImage, setOriginalImage] = useState<File | null>(null);
    const [originalImageUrl, setOriginalImageUrl] = useState<string | null>(null);
    const [editedImageUrl, setEditedImageUrl] = useState<string | null>(null);
    const [prompt, setPrompt] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setOriginalImage(file);
            setOriginalImageUrl(URL.createObjectURL(file));
            setEditedImageUrl(null);
            setError('');
        }
    };

    const handleGenerate = async () => {
        // FIX: Removed apiKey check and updated error message.
        if (!originalImage || !prompt) {
            setError('Please provide an image and a prompt.');
            return;
        }
        setIsLoading(true);
        setError('');
        setEditedImageUrl(null);
        try {
            // FIX: Removed apiKey from editImage call.
            const resultUrl = await editImage(originalImage, prompt);
            setEditedImageUrl(resultUrl);
        } catch (err) {
            console.error(err);
            setError(err instanceof Error ? err.message : 'An unknown error occurred.');
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <div className="p-4 md:p-6 space-y-6 animate-fade-in">
            {/* FIX: Removed conditional rendering based on apiKey. */}
            <div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                    {/* Input Side */}
                    <div className="space-y-4">
                        <div 
                            className="relative border-2 border-dashed border-surface rounded-lg p-8 text-center cursor-pointer hover:border-primary transition-colors"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <input
                                type="file"
                                accept="image/*"
                                ref={fileInputRef}
                                onChange={handleImageChange}
                                className="hidden"
                            />
                            {originalImageUrl ? (
                                <img src={originalImageUrl} alt="Original" className="max-h-64 mx-auto rounded-md" />
                            ) : (
                                <div className="space-y-2 text-text-secondary">
                                    <Icon name="image" className="w-12 h-12 mx-auto" />
                                    <p>Click to upload an image</p>
                                    <p className="text-xs">PNG, JPG, WEBP, etc.</p>
                                </div>
                            )}
                        </div>

                        <div>
                            <label htmlFor="prompt" className="block text-sm font-medium text-text-secondary mb-1">Edit Prompt</label>
                            <textarea
                                id="prompt"
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                placeholder="e.g., Add a retro filter, make the sky blue, remove the person in the background..."
                                rows={3}
                                className="w-full p-2 rounded-md bg-background border border-surface focus:ring-2 focus:ring-primary outline-none"
                                disabled={!originalImage}
                            />
                        </div>

                        <button
                            onClick={handleGenerate}
                            disabled={!originalImage || !prompt || isLoading}
                            className="w-full p-2 flex items-center justify-center gap-2 bg-primary text-white font-semibold rounded-md hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
                        >
                            {isLoading ? (
                                <>
                                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                  <span>Generating...</span>
                                </>
                            ) : (
                                <>
                                  <Icon name="sparkles" className="w-5 h-5" />
                                  <span>Generate</span>
                                </>
                            )}
                        </button>
                        {error && <p className="text-red-400 text-sm text-center">{error}</p>}
                    </div>

                    {/* Output Side */}
                    <div className="bg-surface rounded-lg p-4 min-h-[300px] flex items-center justify-center">
                        {isLoading && (
                            <div className="text-center text-text-secondary space-y-2">
                                <div className="w-8 h-8 mx-auto border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                                <p>AI is working its magic...</p>
                            </div>
                        )}
                        {!isLoading && editedImageUrl && (
                            <img src={editedImageUrl} alt="Edited" className="max-h-96 mx-auto rounded-md" />
                        )}
                        {!isLoading && !editedImageUrl && (
                             <p className="text-text-secondary text-center">Your edited image will appear here</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
