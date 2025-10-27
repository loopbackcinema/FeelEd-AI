

import { GoogleGenAI, Modality } from "@google/genai";

// Helper to create a standardized error response
const createErrorResponse = (message: string, status: number) => {
  return new Response(JSON.stringify({ error: { message } }), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
};


export default async function handler(req: Request) {
  if (req.method !== 'POST') {
    return createErrorResponse('Method not allowed', 405);
  }

  if (!process.env.API_KEY) {
    console.error("CRITICAL: API_KEY environment variable is not set on the server. This is required for Gemini API calls. Please add it to your environment variables.");
    return createErrorResponse("Server configuration error: The application's API key is missing. Please contact the administrator.", 500);
  }

  try {
    const { text, voice } = (await req.json()) as { text: string; voice: string; };
    if (!text || !voice) {
        return createErrorResponse("Missing 'text' or 'voice' in request. Please provide both.", 400);
    }

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text: text }] }],
        config: {
            responseModalities: [Modality.AUDIO],
            speechConfig: {
                voiceConfig: {
                    prebuiltVoiceConfig: { voiceName: voice },
                },
            },
        },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!base64Audio) {
        return createErrorResponse("The AI model did not return any audio data. This can happen with very short or empty text. Please try again.", 500);
    }

    return new Response(JSON.stringify({ base64Audio }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    console.error("Error in /api/generate-audio:", error);
    return createErrorResponse("Failed to generate audio. The text-to-speech service may be temporarily unavailable.", 500);
  }
}