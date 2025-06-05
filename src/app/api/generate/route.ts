// src/app/api/generate/route.ts
import { NextRequest, NextResponse } from 'next/server';
import openai from '@/lib/openaiClient';

export async function POST(req: NextRequest) {
  try {
    const { vibe } = await req.json();

    const prompt = `Generate a plan based on this vibe: ${vibe}.
Return a JSON object with:
- title
- location
- starts_at (ISO 8601 format)
- description
- vibes`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.8,
    });

    const message = completion.choices[0].message?.content || '{}';
    const plan = JSON.parse(message);

    return NextResponse.json(plan);
  } catch (error) {
    console.error('OpenAI error:', error);
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
  }
}
