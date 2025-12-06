import { GoogleGenAI } from "@google/genai";
import { Avatar } from "../types";

// Helper to ensure we have a fresh instance with the injected key
const getAIClient = () => {
  // The API key is injected by the environment variables
  const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY;
  if (!apiKey) {
    throw new Error('API key not found. Please set GEMINI_API_KEY in .env.local');
  }
  return new GoogleGenAI({ apiKey });
};

export const generateAvatarImage = async (prompt: string): Promise<string> => {
  const ai = getAIClient();

  // Using gemini-2.5-flash-image (NanoBanana) for avatar generation
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [
        {
          text: `A high quality, centered character portrait of: ${prompt}. Solid background, professional lighting.`,
        },
      ],
    },
    config: {
      imageConfig: {
        aspectRatio: "1:1",
      }
    }
  });

  // Extract image
  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
    }
  }

  throw new Error("No image generated.");
};

export const generateVideoFromAvatar = async (
  avatar: Avatar,
  prompt: string
): Promise<string> => {
  const ai = getAIClient();

  // Using Veo for video generation
  // We pass the avatar as the starting image
  let operation = await ai.models.generateVideos({
    model: 'veo-3.1-fast-generate-preview',
    prompt: prompt,
    image: {
      imageBytes: avatar.base64Data,
      mimeType: avatar.mimeType,
    },
    config: {
      numberOfVideos: 1,
      resolution: '720p',
      aspectRatio: '16:9' // Or 9:16 depending on preference, 16:9 is standard for web
    }
  });

  // Polling loop
  while (!operation.done) {
    await new Promise(resolve => setTimeout(resolve, 5000)); // Poll every 5 seconds
    operation = await ai.operations.getVideosOperation({ operation: operation });
  }

  const videoUri = operation.response?.generatedVideos?.[0]?.video?.uri;
  if (!videoUri) {
    throw new Error("Video generation failed or no URI returned.");
  }

  // Fetch the actual video blob using the key
  const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY;
  const response = await fetch(`${videoUri}&key=${apiKey}`);
  if (!response.ok) {
    throw new Error("Failed to download generated video.");
  }

  const blob = await response.blob();
  return URL.createObjectURL(blob);
};