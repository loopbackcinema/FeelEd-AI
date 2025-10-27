

import { GoogleGenAI, Type } from "@google/genai";
import type { LessonFormData } from '../types';

// Helper to create a standardized error response
const createErrorResponse = (message: string, status: number) => {
  return new Response(JSON.stringify({ error: { message } }), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
};

// This is a server-side function and will not be exposed to the client.
export default async function handler(req: Request) {
  if (req.method !== 'POST') {
    return createErrorResponse('Method not allowed', 405);
  }

  if (!process.env.API_KEY) {
    console.error("CRITICAL: API_KEY environment variable is not set on the server. This is required for Gemini API calls. Please add it to your environment variables.");
    return createErrorResponse("Server configuration error: The application's API key is missing. Please contact the administrator.", 500);
  }

  try {
    const formData = (await req.json()) as LessonFormData;
    
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const prompt = `
    You are an expert curriculum developer and creative storyteller for an AI platform called "FeelEd".
    Your task is to create an emotionally engaging audio lesson script based on the user's request.
    The output MUST be a valid JSON object that adheres to the provided schema.

    User Request:
    - Concept/Problem: "${formData.concept}"
    - Grade Level: ${formData.grade}
    - Language: ${formData.language}
    - Desired Tone: ${formData.tone}

    Instructions:
    1.  **Title**: Create a short, catchy title for the lesson in the requested language.
    2.  **Story**: Write a short, simple, and relatable story that introduces the concept. The story should match the desired tone and be appropriate for the grade level.
    3.  **Scenes**: Break down the concept explanation into 3-5 simple scenes. For each scene:
        -   'narration': Write the voice-over script in the requested language. Keep it concise.
        -   'visualDescription': Describe the visuals or animation that would accompany the narration. This helps set the scene.
        -   'textOverlay': (Optional) Add very short text to highlight key terms or formulas.
    4.  **Quiz**: Create one multiple-choice question to test understanding of the core concept. Provide 4 options. For each option:
        -   'text': The option text.
        -   'isCorrect': A boolean value (true if it's the correct answer, false otherwise). Exactly one option MUST be correct.
        -   'feedback': A detailed explanation for why this option is correct or incorrect, referencing concepts from the lesson script. This is crucial for learning.
    All quiz text and feedback should be in the requested language.
    5.  **Summary**: Conclude with a brief but powerful summary that is both engaging and detailed. It should be written in the requested language and perfectly match the desired tone.
        -   **Recap Key Points**: Start by briefly recapping the main learning points. Connect these points to a real-world example to make them stick.
        -   **Compelling Call to Action**: End with a single, compelling call to action. This should be a direct question or a fun challenge for the student to ponder or try out, inspiring them to continue thinking about the topic after the lesson is over.
    `;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            responseMimeType: 'application/json',
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    title: { type: Type.STRING },
                    story: { type: Type.STRING },
                    scenes: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                sceneNumber: { type: Type.INTEGER },
                                narration: { type: Type.STRING },
                                visualDescription: { type: Type.STRING },
                                textOverlay: { type: Type.STRING },
                            },
                            required: ['sceneNumber', 'narration', 'visualDescription']
                        }
                    },
                    quiz: {
                        type: Type.OBJECT,
                        properties: {
                            question: { type: Type.STRING },
                            options: { 
                                type: Type.ARRAY, 
                                items: { 
                                    type: Type.OBJECT,
                                    properties: {
                                        text: { type: Type.STRING },
                                        isCorrect: { type: Type.BOOLEAN },
                                        feedback: { type: Type.STRING, description: "A detailed explanation for why this option is correct or incorrect, referencing concepts from the lesson script." }
                                    },
                                    required: ['text', 'isCorrect', 'feedback']
                                } 
                            },
                        },
                         required: ['question', 'options']
                    },
                    summary: { type: Type.STRING },
                },
                 required: ['title', 'story', 'scenes', 'quiz', 'summary']
            },
        },
    });

    let jsonText = response.text.trim();
    
    // Clean potential markdown formatting
    if (jsonText.startsWith('```json')) {
        jsonText = jsonText.substring(7, jsonText.length - 3).trim();
    } else if (jsonText.startsWith('```')) {
        jsonText = jsonText.substring(3, jsonText.length - 3).trim();
    }
    
    const firstBrace = jsonText.indexOf('{');
    const lastBrace = jsonText.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace > firstBrace) {
      jsonText = jsonText.substring(firstBrace, lastBrace + 1);
    }
    
    return new Response(jsonText, {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error("Error in /api/generate-script:", error);
    const userMessage = error.message?.includes('API key not valid') || error.message?.includes("entity was not found")
      ? "The provided API key is invalid or not found. Please select a valid key and try again."
      : "Failed to generate lesson script due to an issue with the AI model.";
    return createErrorResponse(userMessage, 500);
  }
}