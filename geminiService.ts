import { GoogleGenAI, Modality, Chat, Type, Content } from "@google/genai";
import type { ChatMessage } from './types';

const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve((reader.result as string).split(',')[1]);
        reader.onerror = (error) => reject(error);
    });
};

export const editImage = async (imageFile: File, prompt: string): Promise<string> => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const base64Data = await fileToBase64(imageFile);
    
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
            parts: [
                {
                    inlineData: {
                        data: base64Data,
                        mimeType: imageFile.type,
                    },
                },
                {
                    text: prompt,
                },
            ],
        },
        config: {
            responseModalities: [Modality.IMAGE],
        },
    });

    const firstPart = response.candidates?.[0]?.content?.parts?.[0];
    if (firstPart && 'inlineData' in firstPart && firstPart.inlineData) {
        return `data:${firstPart.inlineData.mimeType};base64,${firstPart.inlineData.data}`;
    }

    throw new Error("Could not edit image or invalid response.");
};

export const getTimerSuggestion = async (prompt: string): Promise<{ label: string; duration: number }> => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `Analyze the following request and provide a suitable timer label and duration in seconds. For example, for "soft boiled egg", you might suggest a label of "Soft-boiled Egg" and a duration of 360 seconds. Request: "${prompt}"`,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    label: {
                        type: Type.STRING,
                        description: 'A concise label for the timer, e.g., "Cooking Pasta".',
                    },
                    duration: {
                        type: Type.INTEGER,
                        description: 'The total duration for the timer in seconds.',
                    },
                },
                required: ["label", "duration"],
            },
        },
    });

    const jsonText = response.text.trim();
    try {
        const parsed = JSON.parse(jsonText);
        if (typeof parsed.label === 'string' && typeof parsed.duration === 'number') {
            return parsed;
        }
        throw new Error("Invalid JSON schema in response.");
    } catch (e) {
        console.error("Failed to parse Gemini JSON response:", e);
        throw new Error("Failed to get timer suggestion from AI.");
    }
};

export const createChatSession = (useSearch: boolean, history: ChatMessage[]): Chat => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    // Filter out the initial welcome message from history to not confuse the model
    const filteredHistory = history.filter(m => m.text !== 'Hello! How can I help you today?');

    const geminiHistory: Content[] = filteredHistory.map(msg => ({
        role: msg.role,
        parts: [{ text: msg.text }]
    }));
    
    const systemInstruction = `You are Gee, an advanced AI assistant integrated into GeeClock. You are highly trainable, empathetic, and solution-oriented. 
    Your memory is persistent, so you can recall previous conversations. User feedback on your responses (thumbs up/down) is recorded to help you improve over time. Strive to provide better answers based on past interactions and feedback.
    Your goal is to provide helpful, accurate, and friendly responses. When a user asks a question, be conversational and supportive. If Google Search is enabled, use it to provide up-to-date information and always cite your sources. You can also see the user's running timers to provide context-aware help. Be concise but thorough. Your personality is curious, witty, and professional.`;

    return ai.chats.create({
        model: 'gemini-2.5-flash',
        history: geminiHistory,
        config: {
            systemInstruction,
            tools: useSearch ? [{ googleSearch: {} }] : undefined,
        },
    });
};