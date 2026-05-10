import axios from "axios";

/**
 * Safe Gemini API caller
 */
export const askGemini = async (prompt) => {
  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
        generationConfig: {
          temperature: 0.4,
          topP: 0.8,
          topK: 40,
          maxOutputTokens: 2048,
        },
      }
    );

    const text =
      response?.data?.candidates?.[0]?.content?.parts?.[0]?.text;

    return text || null;
  } catch (error) {
    console.error(
      "Gemini API Error:",
      error?.response?.data || error.message
    );

    return null;
  }
};

/**
 * AI-powered symptom analysis
 */
export const searchBySymptomAI = async (query) => {
  const prompt = `
You are an advanced medical AI assistant.

User symptoms:
"${query}"

IMPORTANT:
- Respond ONLY in valid JSON
- Do NOT add markdown
- Do NOT add explanations outside JSON
- Keep response medically safe
- Never claim final diagnosis

JSON FORMAT:

{
  "possibleConditions": [
    {
      "name": "Condition name",
      "probability": "Low | Medium | High",
      "description": "Short explanation"
    }
  ],
  "commonSymptoms": [
    "symptom 1",
    "symptom 2"
  ],
  "recommendations": [
    "recommendation 1",
    "recommendation 2"
  ],
  "seeDoctor": "When user should seek medical attention",
  "emergency": true
}

Mark emergency=true only for dangerous symptoms.
`;

  const raw = await askGemini(prompt);

  if (!raw) {
    throw new Error("Gemini AI failed");
  }

  try {
    // Remove accidental markdown formatting
    const cleaned = raw
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    return JSON.parse(cleaned);
  } catch (e) {
    console.error("JSON Parse Error:", raw);

    throw new Error("Invalid AI response");
  }
};

/**
 * Simple in-memory rate limiter
 */
export function checkRateLimit(ip) {
  const now = Date.now();

  if (!global.rateLimitStore) {
    global.rateLimitStore = {};
  }

  const limit = global.rateLimitStore[ip];

  // First request
  if (!limit) {
    global.rateLimitStore[ip] = {
      count: 1,
      timestamp: now,
    };

    return { allowed: true };
  }

  const diff = (now - limit.timestamp) / 1000;

  // Reset after 1 minute
  if (diff > 60) {
    global.rateLimitStore[ip] = {
      count: 1,
      timestamp: now,
    };

    return { allowed: true };
  }

  // Max 8 requests/min
  if (limit.count >= 8) {
    return {
      allowed: false,
      retryAfter: Math.ceil(60 - diff),
    };
  }

  limit.count++;

  return { allowed: true };
}