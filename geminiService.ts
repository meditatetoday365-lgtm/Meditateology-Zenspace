import { GoogleGenAI } from "@google/genai";

// We use process.env.API_KEY which is injected by Vite and Vercel
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const generateMeditationScript = async (mood: string, duration: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Create a professional, calming ${duration} meditation script for someone feeling ${mood}. 
                 Include clear breathing instructions and a peaceful visualization. 
                 Format with a clear title and section headers. Keep it concise but impactful.`,
      config: {
        temperature: 0.7,
        topP: 0.95,
      }
    });
    return response.text || "I'm sorry, I couldn't generate a script at the moment. Take a deep breath anyway.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "The sanctuary is currently quiet. Please try again in a moment.";
  }
};

export const getMindfulnessTip = async () => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: "Give me one short, profound mindfulness tip or zen quote for today. Just the tip/quote.",
    });
    return response.text;
  } catch (error) {
    return "In the midst of movement and chaos, keep stillness inside of you.";
  }
};