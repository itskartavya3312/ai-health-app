import axios from "axios";

/**
 * Gemini API Caller
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
          temperature: 0.3,
          topP: 0.8,
          topK: 40,
          maxOutputTokens: 1500,
        },
      }
    );

    return (
      response?.data?.candidates?.[0]?.content?.parts?.[0]?.text || null
    );

  } catch (error) {
    console.error(
      "Gemini API Error:",
      error?.response?.data || error.message
    );

    return null;
  }
};

/**
 * AI Symptom Analysis
 */
export const searchBySymptomAI = async (query) => {

  const prompt = `
You are an AI medical assistant.

Analyze these symptoms:
"${query}"

Return ONLY valid JSON.

{
  "possibleConditions": [
    {
      "name": "Condition",
      "probability": "Low",
      "description": "Short explanation"
    }
  ],
  "commonSymptoms": [
    "symptom 1"
  ],
  "recommendations": [
    "recommendation 1"
  ],
  "seeDoctor": "Advice",
  "emergency": false
}
`;

  const raw = await askGemini(prompt);

  // Fallback if Gemini fails
  if (!raw) {
    return {
      possibleConditions: [
        {
          name: "Unable to analyze",
          probability: "Low",
          description: "AI service temporarily unavailable"
        }
      ],
      commonSymptoms: [],
      recommendations: [
        "Please try again later",
        "Consult a healthcare professional if symptoms continue"
      ],
      seeDoctor: "Seek medical advice if symptoms worsen.",
      emergency: false
    };
  }

  try {

    // Clean markdown if Gemini adds it
    const cleaned = raw
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    return JSON.parse(cleaned);

  } catch (e) {

    console.error("Gemini JSON Parse Failed:", raw);

    // SAFE FALLBACK RESPONSE
    return {
      possibleConditions: [
        {
          name: "General illness",
          probability: "Medium",
          description: raw.substring(0, 200)
        }
      ],
      commonSymptoms: [query],
      recommendations: [
        "Stay hydrated",
        "Get enough rest",
        "Monitor symptoms carefully"
      ],
      seeDoctor: "Consult a doctor if symptoms persist.",
      emergency: false
    };
  }
};

/**
 * Simple Rate Limiter
 */
export function checkRateLimit(ip) {

  if (!global.rateLimitStore) {
    global.rateLimitStore = {};
  }

  const now = Date.now();
  const current = global.rateLimitStore[ip];

  // First request
  if (!current) {
    global.rateLimitStore[ip] = {
      count: 1,
      timestamp: now,
    };

    return { allowed: true };
  }

  const diff = (now - current.timestamp) / 1000;

  // Reset after 1 minute
  if (diff > 60) {

    global.rateLimitStore[ip] = {
      count: 1,
      timestamp: now,
    };

    return { allowed: true };
  }

  // Max 10 req/min
  if (current.count >= 10) {

    return {
      allowed: false,
      retryAfter: Math.ceil(60 - diff),
    };
  }

  current.count++;

  return { allowed: true };
}