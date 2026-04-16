import { NextResponse } from 'next/server';
import { connectDB } from "../../../lib/mongodb";
import Disease from "../../../models/Disease";
import AiCache, { makeCacheKey } from "../../../models/AiCache";
import { searchBySymptomAI, checkRateLimit } from "../../../lib/gemini";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get('q')?.trim().substring(0, 100);
  const mode = searchParams.get('mode') || 'autocomplete';
  if (!q || q.length < 2) return NextResponse.json({ success: true, data: [] });

  try {
    await connectDB();
    // Regex search (works without text index)
    const rgx = { $regex: q, $options: 'i' };
    const results = await Disease.find({ $or: [{ name: rgx }, { aliases: rgx }, { symptoms: rgx }] })
      .limit(mode === 'autocomplete' ? 6 : 12).select('name slug category icon overview severity').lean();

    if (results.length > 0) return NextResponse.json({ success: true, data: results, source: 'db' });
    if (mode === 'autocomplete') return NextResponse.json({ success: true, data: [] });

    // Full search: try cache then Gemini
    const key = makeCacheKey('search', q);
    const cached = await AiCache.getCache(key);
    if (cached) { try { return NextResponse.json({ success: true, data: JSON.parse(cached), source: 'cache' }); } catch {} }

    const ip = req.headers.get('x-forwarded-for') || 'unknown';
    if (!checkRateLimit(ip).allowed) return NextResponse.json({ success: false, error: 'Rate limit', data: [] }, { status: 429 });

    const aiResults = await searchBySymptomAI(q);
    await AiCache.setCache(key, 'search', q, JSON.stringify(aiResults), 1);
    return NextResponse.json({ success: true, data: aiResults, source: 'gemini' });
  } catch (e) {
    return NextResponse.json({ success: false, error: e.message, data: [] }, { status: 500 });
  }
}
