import { NextRequest, NextResponse } from 'next/server';
import { connectMongo } from '@/lib/db/mongo';
import { UserModel } from '@/lib/db/models/User';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;
    const { searchParams } = new URL(request.url);
    const provider = searchParams.get('provider');
    
    if (!provider || (provider !== 'gemini' && provider !== 'openai')) {
      return NextResponse.json(
        { error: 'Provider must be gemini or openai' },
        { status: 400 }
      );
    }
    
    await connectMongo();
    
    const user = await UserModel.findOne({ userId }).lean();
    
    if (!user) {
      return NextResponse.json({ hasKey: false, key: null });
    }
    
    const apiKey = provider === 'gemini' ? user.geminiApiKey : user.openaiApiKey;
    
    return NextResponse.json({ 
      hasKey: !!apiKey,
      key: apiKey || null,
    });
  } catch (error) {
    console.error('Error fetching API key:', error);
    return NextResponse.json(
      { error: 'Failed to fetch API key' },
      { status: 500 }
    );
  }
}

