
import { GoogleGenAI, Modality } from "@google/genai";
import { dataURLtoFile } from '../utils/fileUtils';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

async function fileToBase64(file: File): Promise<{ mimeType: string; data: string }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const [mimePart, base64Part] = result.split(';base64,');
      if (!mimePart || !base64Part) {
        reject(new Error("Invalid data URL format"));
        return;
      }
      const mimeType = mimePart.split(':')[1];
      if (!mimeType) {
        reject(new Error("Could not determine MIME type"));
        return;
      }
      resolve({ mimeType, data: base64Part });
    };
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
}

export const generatePortrait = async (imageFile: File, prompt: string): Promise<string> => {
    const { mimeType, data: base64ImageData } = await fileToBase64(imageFile);
    
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image-preview',
        contents: {
            parts: [
                { inlineData: { data: base64ImageData, mimeType } },
                { text: prompt },
            ],
        },
        config: {
            responseModalities: [Modality.IMAGE, Modality.TEXT],
        },
    });

    let imageUrl: string | null = null;
    let potentialErrorText: string | null = null;

    // The API can return multiple parts, we must find the one with image data.
    for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
            const base64ImageBytes = part.inlineData.data;
            const imageMimeType = part.inlineData.mimeType;
            imageUrl = `data:${imageMimeType};base64,${base64ImageBytes}`;
            // We found the image, which is the primary goal. Stop searching.
            break; 
        }
        // If there's a text part, save it. It might be a conversational filler
        // or an actual error message if no image is produced.
        if (part.text) {
            potentialErrorText = part.text;
        }
    }

    // If we found an image URL, that's a success. Return it.
    if (imageUrl) {
        return imageUrl;
    }
    
    // If we didn't find an image, now we can assume it's an error.
    // If we captured some text from the API, include it for better debugging.
    if (potentialErrorText) {
        throw new Error(`API returned text instead of an image: ${potentialErrorText}`);
    }

    // If there was no image and no text, throw a generic error.
    throw new Error("No image data found in the API response.");
};
