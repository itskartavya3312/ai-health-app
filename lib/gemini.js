import axios from "axios";

/**
 * Call Gemini API safely
 */
export const askGemini = async (prompt) => {
  try {
    const res = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [{ parts: [{ text: prompt }] }],
      }
    );

    return (
      res?.data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No response from AI"
    );
  } catch (error) {
    console.error("Gemini Error:", error.response?.data || error.message);

    // 👇 IMPORTANT: return proper error
    return null;
  }
};

/**
 * AI-powered symptom search
 */
export const searchBySymptomAI = async (query) => {
  const prompt = `
You are a medical assistant AI.

User symptoms: ${query}

Respond with:
1. Possible conditions
2. Symptoms explanation
3. When to see a doctor
4. Basic precautions

IMPORTANT:
- Do NOT give final diagnosis
- Be safe and responsible
`;

  return await askGemini(prompt);
};

/**
 * Rate limiter (simple in-memory)
 */
export function checkRateLimit(ip) {
  const now = Date.now();

  if (!global.rateLimit) global.rateLimit = {};

  if (!global.rateLimit[ip]) {
    global.rateLimit[ip] = { count: 1, time: now };
    return { allowed: true };
  }

  const diff = (now - global.rateLimit[ip].time) / 1000;

  // 🚫 Block if too many requests
  if (diff < 60 && global.rateLimit[ip].count >= 5) {
    return {
      allowed: false,
      retryAfter: Math.ceil(60 - diff),
    };
  }

  // 🔄 Reset after 1 min
  if (diff >= 60) {
    global.rateLimit[ip] = { count: 1, time: now };
  } else {
    global.rateLimit[ip].count++;
  }

  return { allowed: true };
}