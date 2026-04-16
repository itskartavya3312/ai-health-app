import axios from "axios";

// Main Gemini call
export const askGemini = async (prompt) => {
  try {
    const res = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [{ parts: [{ text: prompt }] }],
      }
    );

    return res.data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error("Gemini Error:", error.message);
    return "Error fetching AI response";
  }
};

// Used in search route
export const searchBySymptomAI = async (query) => {
  const prompt = `Provide medical information for: ${query}. Include symptoms, causes, and treatment.`;
  return await askGemini(prompt);
};

// Dummy rate limit (to avoid crash)
export const checkRateLimit = () => {
  return true;
};