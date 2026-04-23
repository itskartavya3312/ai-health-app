import { NextResponse } from 'next/server';
import { connectDB } from "../../../lib/mongodb";
import AiCache, { makeCacheKey } from "../../../models/AiCache";
import { searchBySymptomAI, checkRateLimit } from "../../../lib/gemini";

export async function POST(req) {
  try {
    const { symptoms } = await req.json();

    // Validation
    if (!symptoms || symptoms.trim().length < 3) {
      return NextResponse.json(
        { success: false, error: 'Please describe your symptoms properly.' },
        { status: 400 }
      );
    }

    // Rate limit
    const ip = req.headers.get('x-forwarded-for') || 'unknown';
    const rl = checkRateLimit(ip);

    if (!rl.allowed) {
      return NextResponse.json(
        { success: false, error: `Rate limit exceeded. Try again later.` },
        { status: 429 }
      );
    }

    // DB connect
    await connectDB();

    const safeInput = symptoms.trim().substring(0, 500);
    const key = makeCacheKey('symptom', safeInput);

    // Check cache
    const cached = await AiCache.getCache(key);
    if (cached) {
      try {
        return NextResponse.json({
          success: true,
          data: JSON.parse(cached),
          cached: true,
        });
      } catch {}
    }

    // AI call
    const analysis = await searchBySymptomAI(safeInput);

    // Save cache
    await AiCache.setCache(
      key,
      'symptom',
      safeInput,
      JSON.stringify(analysis),
      1
    );

    return NextResponse.json({
      success: true,
      data: analysis,
    });

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { success: false, error: 'Analysis failed. Try again.' },
      { status: 500 }
    );
  }
}