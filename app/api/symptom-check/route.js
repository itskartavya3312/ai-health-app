import { NextResponse } from 'next/server';
import { connectDB } from "../../../lib/mongodb";
import AiCache from "../../../models/AiCache";
import { analyseSymptoms, checkRateLimit } from "../../../lib/gemini";

export async function POST(req) {
  try {
    const { symptoms } = await req.json();
    if (!symptoms?.trim() || symptoms.trim().length < 3)
      return NextResponse.json({ success: false, error: 'Please describe your symptoms.' }, { status: 400 });

    const ip = req.headers.get('x-forwarded-for') || 'unknown';
    const rl = checkRateLimit(ip);
    if (!rl.allowed) return NextResponse.json({ success: false, error: `Rate limit. Retry in ${rl.resetIn}s` }, { status: 429 });

    await connectDB();
    const safe = symptoms.trim().substring(0, 500);
    const key = makeCacheKey('symptom', safe);
    const cached = await AiCache.getCache(key);
    if (cached) { try { return NextResponse.json({ success: true, data: JSON.parse(cached), cached: true }); } catch {} }

    const analysis = await analyseSymptoms(safe);
    await AiCache.setCache(key, 'symptom', safe, JSON.stringify(analysis), 1);
    return NextResponse.json({ success: true, data: analysis });
  } catch (e) {
    return NextResponse.json({ success: false, error: 'Analysis failed. Try again.' }, { status: 500 });
  }
}
