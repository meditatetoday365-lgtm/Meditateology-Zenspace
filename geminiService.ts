import { GoogleGenAI } from "@google/genai";

/**
 * We look for three variations to be extra safe:
 * 1. The standard: VITE_GEMINI_API_KEY
 * 2. The one from your screenshot: VITEGEMINIAPIKEY
 * 3. The generic fallback: API_KEY
 */
const apiKey = 
  process.env.VITE_GEMINI_API_KEY || 
  process.env.VITEGEMINIAPIKEY || 
  process.env.API_KEY || 
  '';

const ai = new GoogleGenAI({ apiKey });

export const generateMeditationScript = async (mood: string, duration: string) => {
  // If no key is found, we show a very specific helpful message to the owner
  if (!apiKey) {
    console.error("Meditateology: API Key is missing from Environment Variables.");
    return "OWNER NOTICE: The AI is currently offline. Please check your Vercel Environment Variables for VITE_GEMINI_API_KEY and ensure you have Redeployed the site.";
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `You are the Meditateology AI. Create a professional, calming ${duration} meditation script for someone feeling ${mood}. 
                 Include clear breathing instructions and a peaceful visualization. 
                 Format with a clear title and section headers.`,
      config: {
        temperature: 0.7,
      }
    });
    return response.text || "I'm sorry, I couldn't generate a script. Please try again.";
  } catch (error: any) {
    console.error("Gemini API Error details:", error);
    if (error?.message?.includes('API_KEY_INVALID')) {
      return "OWNER NOTICE: The API Key provided is invalid. Please check your Google AI Studio account.";
    }
    return "The Zen Master is currently meditating deeply (connection error). Please try again in a moment.";
  }
};

export const getMindfulnessTip = async () => {
  if (!apiKey) return "Breathe in peace, breathe out stress.";
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: "Give me one short, profound mindfulness tip for today. Just the tip.",
    });
    return response.text;
  } catch (error) {
    return "In the midst of movement and chaos, keep stillness inside of you.";
  }
};