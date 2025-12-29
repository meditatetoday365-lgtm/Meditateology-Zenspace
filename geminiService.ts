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
    return "OWNER NOTICE: The AI is currently offline. Please check your Vercel Environment Variables.";
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `You are the Meditateology AI. Create a professional, calming ${duration} meditation script for someone feeling ${mood}. 
                 Include clear breathing instructions and a peaceful visualization. 
                 Format with a clear title and section headers. Keep instructions simple for a listener.`,
      config: {
        temperature: 0.7,
      }
    });
    return response.text || "I'm sorry, I couldn't generate a script. Please try again.";
  } catch (error: any) {
    console.error("Gemini API Error details:", error);
    return "The Zen Master is currently meditating deeply. Please try again in a moment.";
  }
};

/**
 * Converts text into high-quality speech using Gemini TTS.
 * Optimized for slower, more intentional meditation speech.
 */
export const generateSpeech = async (text: string) => {
  if (!apiKey) return null;

  try {
    // Gemini 2.5 Flash TTS handles up to ~2k chars well. 
    // We clean markdown symbols to make the speech flow better.
    const cleanText = text.replace(/[*#]/g, '').substring(0, 1500);
    
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ 
        parts: [{ 
          text: `Read this meditation script as a wise Zen Master. Speak very slowly, with long pauses between sentences for the listener to breathe and visualize. Voice should be calm, warm, and deeply grounding. Script: ${cleanText}` 
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
      contents: "Give me one short, profound mindfulness tip for today. Just the tip.",
    });
    return response.text;
  } catch (error) {
    return "In the midst of movement and chaos, keep stillness inside of you.";
  }
};