import { NextRequest, NextResponse } from 'next/server';
import { createStudyKit, getAllStudyKits } from '@/lib/db/queries';

export async function GET() {
  try {
    const studyKits = await getAllStudyKits();
    return NextResponse.json(studyKits);
  } catch (error) {
    console.error('Error fetching study kits:', error);
    return NextResponse.json({ error: 'Failed to fetch study kits' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const studyKit = await createStudyKit(body);
    return NextResponse.json(studyKit, { status: 201 });
  } catch (error) {
    console.error('Error creating study kit:', error);
    return NextResponse.json({ error: 'Failed to create study kit' }, { status: 500 });
  }
}