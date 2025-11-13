import { GoogleGenAI } from "@google/genai";
import { SummaryType } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  // This is a client-side check. The API key is expected to be in the environment.
  // In a real app, you would not expose the key and use a backend proxy.
  // For this exercise, we assume it's available.
  console.warn("API key not found. Please set the API_KEY environment variable.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const getInstruction = (type: SummaryType, hasText: boolean, hasImage: boolean): string => {
    let subject = "";
    if (hasText && hasImage) subject = "the following text and image";
    else if (hasText) subject = "the following text";
    else if (hasImage) subject = "the following image";
    else return ""; // Should not happen

    switch (type) {
        case SummaryType.Brief:
            return `Summarize ${subject} into a concise, clean, and easy-to-read single paragraph. Focus on the main points and key takeaways.`;
        case SummaryType.Detailed:
             // This case is handled by the UI paywall, but the prompt is here for completeness.
            return `Provide a detailed, multi-point summary of ${subject}. Use bullet points for key takeaways to make it structured and easy to digest.`;
        default:
          return `Summarize ${subject}.`;
    }
}

export const summarizeText = async (
  text: string,
  type: SummaryType,
  onUpdate: (chunk: string) => void,
  image?: { data: string; mimeType: string; } | null
): Promise<void> => {
  if (!API_KEY) {
    throw new Error("API key is not configured. Cannot connect to the AI service.");
  }
  
  try {
    const instruction = getInstruction(type, !!text.trim(), !!image);
    
    const parts: any[] = [{ text: instruction }];

    if (image) {
      parts.push({
        inlineData: {
          mimeType: image.mimeType,
          data: image.data,
        },
      });
    }

    if (text.trim()) {
      parts.push({ text });
    }

    const responseStream = await ai.models.generateContentStream({
      model: 'gemini-2.5-flash',
      contents: { parts: parts },
    });
    
    for await (const chunk of responseStream) {
      onUpdate(chunk.text);
    }

  } catch (error) {
    console.error('Error calling Gemini API:', error);
    if (error instanceof Error && error.message.includes('API key not valid')) {
       throw new Error('The configured API key is invalid. Please check your credentials.');
    }
    throw new Error('Failed to generate summary. The AI service may be temporarily unavailable.');
  }
};