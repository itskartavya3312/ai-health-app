import { NextResponse } from 'next/server';
import { connectDB } from "../../../../lib/mongodb";
import Disease from "../../../../models/Disease";
import AiCache from "../../../../models/AiCache";
import { askGemini } from "../../../../lib/gemini";

export async function GET(req, { params }) {
  const { slug } = params;
  try {
    await connectDB();
    // 1. DB lookup
    const found = await Disease.findOne({ slug: slug.toLowerCase() }).lean();
    if (found) {
      Disease.updateOne({ _id: found._id }, { $inc: { views: 1 } }).exec();
      return NextResponse.json({ success: true, data: found });
    }
    // 2. AI Cache
    const key = makeCacheKey('disease', slug);
    const cached = await AiCache.getCache(key);
    if (cached) {
      try { return NextResponse.json({ success: true, data: JSON.parse(cached) }); } catch {}
    }
    // 3. Rate limit
    const ip = req.headers.get('x-forwarded-for') || 'unknown';
    const rl = checkRateLimit(ip);
    if (!rl.allowed) return NextResponse.json({ success: false, error: `Rate limit. Retry in ${rl.resetIn}s` }, { status: 429 });
    // 4. Generate with Gemini
    let aiData;
    try { aiData = await generateDiseaseInfo(slug.replace(/-/g, ' ')); }
    catch (e) { return NextResponse.json({ success: false, error: `Not found: ${slug}` }, { status: 404 }); }
    // 5. Upsert to DB + cache
    const doc = { ...aiData, slug: aiData.slug || slug, source: 'gemini' };
    const saved = await Disease.findOneAndUpdate({ slug: doc.slug }, { $set: doc }, { upsert: true, new: true, runValidators: false }).lean();
    await AiCache.setCache(key, 'disease', slug, JSON.stringify(saved), 7);
    return NextResponse.json({ success: true, data: saved });
  } catch (e) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}
