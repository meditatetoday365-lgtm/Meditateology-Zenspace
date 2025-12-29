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
    return "The Zen Master is currently offline. Please check your system configuration.";
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `You are the Meditateology AI. Create a professional, calming ${duration} meditation script for someone feeling ${mood}. 
                 Include clear breathing instructions and a peaceful visualization. 
                 Keep it flowing and natural. Format with a clear title.`,
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
    const cleanText = text.replace(/[*#]/g, '').substring(0, 1000); // Optimized length for performance
    
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ 
        parts: [{ 
          text: `Read this meditation script as a wise Zen Master. Speak with a gentle, flowing, and natural cadence. Avoid overly long pauses. Maintain a soothing but steady rhythm suitable for an engaging meditation guide. Voice: warm and grounding. Script: ${cleanText}` 
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

    return response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data || null;
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
    return "Keep stillness inside of you, even in chaos.";
  }
};