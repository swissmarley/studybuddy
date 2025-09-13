import { NextRequest, NextResponse } from 'next/server';
import { getStudyKitById, updateStudyKit, deleteStudyKit } from '@/lib/db/queries';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const studyKit = await getStudyKitById(params.id);
    
    if (!studyKit) {
      return NextResponse.json({ error: 'Study kit not found' }, { status: 404 });
    }

    return NextResponse.json(studyKit);
  } catch (error) {
    console.error('Error fetching study kit:', error);
    return NextResponse.json({ error: 'Failed to fetch study kit' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const studyKit = await updateStudyKit(params.id, body);
    
    if (!studyKit) {
      return NextResponse.json({ error: 'Study kit not found' }, { status: 404 });
    }

    return NextResponse.json(studyKit);
  } catch (error) {
    console.error('Error updating study kit:', error);
    return NextResponse.json({ error: 'Failed to update study kit' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const success = await deleteStudyKit(params.id);
    
    if (!success) {
      return NextResponse.json({ error: 'Study kit not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Study kit deleted successfully' });
  } catch (error) {
    console.error('Error deleting study kit:', error);
    return NextResponse.json({ error: 'Failed to delete study kit' }, { status: 500 });
  }
}