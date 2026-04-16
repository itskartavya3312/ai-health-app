import { NextResponse } from 'next/server';
import { askGemini } from "../../../lib/gemini";

export async function POST(req) {
  try {
    const { question, history = [] } = await req.json();
    if (!question?.trim()) return NextResponse.json({ success: false, error: 'Question required' }, { status: 400 });
    const ip = req.headers.get('x-forwarded-for') || 'unknown';
    if (!checkRateLimit(ip).allowed) return NextResponse.json({ success: false, error: 'Rate limit exceeded' }, { status: 429 });
    const answer = await answerHealthQuestion(question, history);
    return NextResponse.json({ success: true, answer });
  } catch (e) {
    return NextResponse.json({ success: false, error: 'Chat unavailable. Try again.' }, { status: 500 });
  }
}
