# 🧘 Meditateology - AI-Powered Mindfulness Sanctuary

Welcome to the official repository for **Meditateology**. This is a modern, high-performance web application designed to bring peace and clarity to users through cutting-edge AI technology.

## 🚀 Key Features
- **Live Zen Master**: Real-time voice interaction with an AI Zen guide (powered by Gemini 2.5).
- **AI Meditation Architect**: Generates custom meditation scripts based on user mood and needs.
- **Dynamic Breathing Tool**: Interactive visual guides for nervous system regulation.
- **Sage & Gold Branding**: A premium, wellness-focused aesthetic.

## 🛠 Owner Setup (How to make it work)

To get the AI features working on your live website, you must follow these steps exactly:

1. **Get your API Key**: Go to [Google AI Studio](https://aistudio.google.com/) and create a free API Key.
2. **Add to Vercel**: 
   - Go to your project in the Vercel Dashboard.
   - Go to **Settings** -> **Environment Variables**.
   - Create a new variable.
   - **Name**: `VITE_GEMINI_API_KEY` (Use underscores `_`, not dashes).
   - **Value**: Paste your key from Google.
3. **CRITICAL STEP**: After adding the key, go to the **Deployments** tab in Vercel. Click the three dots `...` on your latest deployment and select **Redeploy**. This "bakes" the key into your website code.

## 📈 Troubleshooting
If you see the message "The sanctuary is currently quiet":
- Double check that the variable name in Vercel is exactly `VITE_GEMINI_API_KEY`.
- Ensure you have **Redeployed** since adding the variable.
- Check that your Google API Key is active.

---
*Crafted with intention for inner peace.*