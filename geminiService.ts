import { GoogleGenAI } from "@google/genai";

// This looks for the name in your Vercel screenshot OR the standard version
const apiKey = process.env.VITE_GEMINI_API_KEY || process.env.VITEGEMINIAPIKEY || '';
const ai = new GoogleGenAI({ apiKey });

export const generateMeditationScript = async (mood: string, duration: string) => {
  if (!apiKey) {
    console.error("API Key missing. Current env:", process.env);
    return "The sanctuary is currently quiet. Please ensure your VITE_GEMINI_API_KEY is set in Vercel and you have Redeployed.";
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
  } catch (error) {
    console.error("Gemini API Error details:", error);
    return "The Zen Master is currently meditating. Please try again in a few moments.";
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