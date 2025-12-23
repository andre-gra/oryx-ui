// To use the AI features, you need a Gemini API key.
// 1. Visit https://makersuite.google.com/app/apikey to get your API key.
// 2. Create a .env file in the root of the project.
// 3. Add the following line to the .env file:
// VITE_GEMINI_API_KEY=YOUR_API_KEY
// Make sure to replace YOUR_API_KEY with your actual API key.

// We use import.meta.env.VITE_GEMINI_API_KEY to access the environment variable.
// This is a Vite-specific feature.

export const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
