import { NextResponse } from 'next/server';
import { connectDB } from "../../../lib/mongodb";
import Disease from "../../../models/Disease";

export async function GET(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const cat = searchParams.get('category');
    const q = cat && cat !== 'all' ? { category: cat } : {};
    const diseases = await Disease.find(q).sort({ views: -1, name: 1 }).limit(200).select('-__v').lean();
    return NextResponse.json({ success: true, data: diseases, total: diseases.length });
  } catch (e) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();
    if (!body.slug && body.name) body.slug = body.name.toLowerCase().replace(/[^a-z0-9\s-]/g,'').replace(/\s+/g,'-');
    const d = await Disease.create(body);
    return NextResponse.json({ success: true, data: d }, { status: 201 });
  } catch (e) {
    return NextResponse.json({ success: false, error: e.message }, { status: e.code === 11000 ? 409 : 400 });
  }
}
