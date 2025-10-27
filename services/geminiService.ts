

import type { LessonFormData, LessonScript } from './types';
import { createWavBlob, decode } from '../utils/audioUtils';

/**
 * A reusable handler for API responses that standardizes error handling.
 * It expects a consistent error format from the backend: { error: { message: "..." } }
 * @param response The fetch Response object.
 * @returns The JSON body of the response if successful.
 * @throws An Error with a user-friendly message if the request fails.
 */
async function handleApiResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
        try {
            const errorData = await response.json();
            const message = errorData?.error?.message || `Request failed with status ${response.status}`;
            throw new Error(message);
        } catch (e) {
            throw new Error(`An unexpected server error occurred (status ${response.status}).`);
        }
    }
    return await response.json() as T;
}


export async function generateLessonScript(formData: LessonFormData): Promise<LessonScript> {
    const response = await fetch('/api/generate-script', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
    });
    return handleApiResponse<LessonScript>(response);
}

export async function generateLessonAudio(script: LessonScript, voice: string): Promise<string> {
    const fullNarration = script.scenes.map(s => s.narration).join('\n\n');
    
    try {
        const { base64Audio } = await generateSpeech(fullNarration, voice);
        const pcmData = decode(base64Audio);
        // The TTS model provides 16-bit PCM at 24000 Hz, single channel
        const audioBlob = createWavBlob(pcmData, 24000, 1, 16);
        return URL.createObjectURL(audioBlob);
    } catch (error) {
        console.error("Error generating lesson audio:", error);
        // Re-throw the user-friendly message from the service
        throw new Error(error instanceof Error ? error.message : "An unknown error occurred while preparing audio.");
    }
}


export async function generateSpeech(text: string, voice: string): Promise<{ base64Audio: string }> {
     const response = await fetch('/api/generate-audio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, voice }),
    });
    return handleApiResponse<{ base64Audio: string }>(response);
}


export async function generateSceneImage(prompt: string): Promise<string> {
    const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
    });
    const { imageUrl } = await handleApiResponse<{ imageUrl: string }>(response);
     if (!imageUrl) {
        throw new Error("Image URL was missing in the server's response.");
    }
    return imageUrl;
}