import { NextResponse } from 'next/server';

import { connectDB } from '../../../lib/mongodb';

import Disease from '../../../models/Disease';

import AiCache, {
  makeCacheKey,
} from '../../../models/AiCache';

import {
  searchBySymptomAI,
  checkRateLimit,
} from '../../../lib/gemini';

// Clean user query
function normalizeQuery(q = '') {
  return q
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, ' ');
}

// Score search relevance
function scoreDisease(disease, query) {
  let score = 0;

  const q = query.toLowerCase();

  // Exact name
  if (disease.name?.toLowerCase() === q) {
    score += 100;
  }

  // Starts with
  if (disease.name?.toLowerCase().startsWith(q)) {
    score += 50;
  }

  // Includes name
  if (disease.name?.toLowerCase().includes(q)) {
    score += 30;
  }

  // Symptoms match
  if (
    disease.symptoms?.some(symptom =>
      symptom.toLowerCase().includes(q)
    )
  ) {
    score += 20;
  }

  // Aliases match
  if (
    disease.aliases?.some(alias =>
      alias.toLowerCase().includes(q)
    )
  ) {
    score += 15;
  }

  return score;
}

export async function GET(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);

    const rawQuery = searchParams.get('q') || '';

    const mode =
      searchParams.get('mode') || 'autocomplete';

    const query = normalizeQuery(rawQuery).substring(
      0,
      100
    );

    if (!query || query.length < 2) {
      return NextResponse.json({
        success: true,
        data: [],
      });
    }

    // Regex
    const regex = {
      $regex: query,
      $options: 'i',
    };

    // Database search
    const dbResults = await Disease.find({
      $or: [
        { name: regex },
        { aliases: regex },
        { symptoms: regex },
        { overview: regex },
        { category: regex },
      ],
    })
      .select(
        `
          name
          slug
          category
          icon
          overview
          severity
          symptoms
          aliases
        `
      )
      .limit(mode === 'autocomplete' ? 8 : 20)
      .lean();

    // Rank results
    const ranked = dbResults
      .map(d => ({
        ...d,
        relevanceScore: scoreDisease(d, query),
      }))
      .sort(
        (a, b) =>
          b.relevanceScore - a.relevanceScore
      );

    // Remove duplicate slugs
    const unique = ranked.filter(
      (item, index, self) =>
        index ===
        self.findIndex(
          t => t.slug === item.slug
        )
    );

    // If DB has results
    if (unique.length > 0) {
      return NextResponse.json({
        success: true,
        source: 'database',
        count: unique.length,
        data: unique,
      });
    }

    // Autocomplete should NOT hit AI
    if (mode === 'autocomplete') {
      return NextResponse.json({
        success: true,
        source: 'database',
        count: 0,
        data: [],
      });
    }

    // AI fallback
    const cacheKey = makeCacheKey(
      'search',
      query
    );

    const cached = await AiCache.getCache(
      cacheKey
    );

    if (cached) {
      try {
        return NextResponse.json({
          success: true,
          source: 'cache',
          ai: true,
          data: JSON.parse(cached),
        });
      } catch {}
    }

    // Rate limit
    const ip =
      req.headers.get('x-forwarded-for') ||
      'unknown';

    const rl = checkRateLimit(ip);

    if (!rl.allowed) {
      return NextResponse.json(
        {
          success: false,
          error:
            'Too many searches. Please wait.',
          data: [],
        },
        { status: 429 }
      );
    }

    // Gemini fallback
    const aiResults =
      await searchBySymptomAI(query);

    // Save cache
    await AiCache.setCache(
      cacheKey,
      'search',
      query,
      JSON.stringify(aiResults),
      1
    );

    return NextResponse.json({
      success: true,
      source: 'gemini',
      ai: true,
      data: aiResults,
    });

  } catch (error) {
    console.error('Search API Error:', error);

    return NextResponse.json(
      {
        success: false,
        error:
          'Search failed. Please try again.',
        data: [],
      },
      {
        status: 500,
      }
    );
  }
}