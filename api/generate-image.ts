

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
    console.error("API_KEY environment variable not set on the server");
    return createErrorResponse("Server configuration error: API key is missing.", 500);
  }

  try {
    const { prompt } = (await req.json()) as { prompt: string };
    if (!prompt) {
        return createErrorResponse("Missing 'prompt' in request. Please provide a visual description.", 400);
    }
    
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
            parts: [{ text: prompt }],
        },
        config: {
            responseModalities: [Modality.IMAGE],
        },
    });

    for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
            const base64ImageBytes: string = part.inlineData.data;
            const imageUrl = `data:image/png;base64,${base64ImageBytes}`;
            return new Response(JSON.stringify({ imageUrl }), {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
            });
        }
    }

    return createErrorResponse("The AI model did not return any image data. Please try again with a different description.", 500);

  } catch (error: any) {
    console.error("Error in /api/generate-image:", error);
    return createErrorResponse("Failed to generate the image. The image generation service may be temporarily unavailable or the prompt was rejected.", 500);
  }
}