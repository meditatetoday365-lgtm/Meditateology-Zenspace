import { GoogleGenAI, Modality } from "@google/genai";

const apiKey = 
  process.env.VITE_GEMINI_API_KEY || 
  process.env.VITEGEMINIAPIKEY || 
  process.env.API_KEY || 
  '';

const ai = new GoogleGenAI({ apiKey });

export const generateMeditationScript = async (mood: string, duration: string) => {
  if (!apiKey) {
    console.error("Meditateology: API Key is missing.");
    return "Owner Notice: Please configure your Gemini API Key in the environment variables.";
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `You are the Meditateology AI. Create a professional, calming ${duration} meditation script for someone feeling ${mood}. 
                 Include clear breathing instructions and a peaceful visualization. 
                 Format with a clear title and section headers. Keep it impactful and clear.`,
      config: {
        temperature: 0.7,
      }
    });
    return response.text || "I'm sorry, I couldn't generate a script. Please try again.";
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    return "The Zen Master is currently meditating deeply. Please try again in a moment.";
  }
};

export const generateSpeech = async (text: string) => {
  if (!apiKey) return null;

  try {
    // Limit text length for stability and clean symbols
    const cleanText = text.replace(/[*#]/g, '').substring(0, 1200);
    
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ 
        parts: [{ 
          text: `Read this meditation script as a wise Zen Master. Speak at a natural, gentle, and calm meditation pace with comfortable pauses for breathing. Voice: warm, soothing, and grounding. Script: ${cleanText}` 
        }] 
      }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Kore' },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    return base64Audio || null;
  } catch (error) {
    console.error("Speech Generation Error:", error);
    return null;
  }
};

export const getMindfulnessTip = async () => {
  if (!apiKey) return "Breathe in peace, breathe out stress.";
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: "Give me one short, profound mindfulness tip for today.",
    });
    return response.text;
  } catch (error) {
    return "In the midst of movement and chaos, keep stillness inside of you.";
  }
};