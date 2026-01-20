import { NextRequest, NextResponse } from 'next/server';
import { connectMongo } from '@/lib/db/mongo';
import { UserModel } from '@/lib/db/models/User';

interface UserSettingsDocument {
  aiProvider?: 'gemini' | 'openai';
  geminiApiKey?: string;
  openaiApiKey?: string;
  fingerprint?: any;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;
    await connectMongo();
    
    const user = await UserModel.findOne({ userId }).lean() as UserSettingsDocument | null;
    
    if (!user) {
      return NextResponse.json({
        aiProvider: 'gemini',
        fingerprint: null,
        hasGeminiKey: false,
        hasOpenAiKey: false,
      });
    }
    
    return NextResponse.json({
      aiProvider: user.aiProvider || 'gemini',
      fingerprint: user.fingerprint || null,
      hasGeminiKey: !!user.geminiApiKey,
      hasOpenAiKey: !!user.openaiApiKey,
    });
  } catch (error) {
    console.error('Error fetching user settings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user settings' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;
    const body = await request.json();
    const { aiProvider, geminiApiKey, openaiApiKey, fingerprint } = body;
    
    await connectMongo();
    
    const updates: any = {};
    
    if (aiProvider !== undefined) {
      if (aiProvider === 'gemini' || aiProvider === 'openai') {
        updates.aiProvider = aiProvider;
      }
    }
    
    if (geminiApiKey !== undefined) {
      // Если пустая строка или null, удаляем ключ
      if (geminiApiKey === null || geminiApiKey === '') {
        updates.geminiApiKey = null;
      } else if (typeof geminiApiKey === 'string') {
        updates.geminiApiKey = geminiApiKey.trim();
      }
    }
    
    if (openaiApiKey !== undefined) {
      // Если пустая строка или null, удаляем ключ
      if (openaiApiKey === null || openaiApiKey === '') {
        updates.openaiApiKey = null;
      } else if (typeof openaiApiKey === 'string') {
        updates.openaiApiKey = openaiApiKey.trim();
      }
    }
    
    if (fingerprint !== undefined) {
      // Если null или пустой объект, сохраняем null
      if (fingerprint === null) {
        updates.fingerprint = null;
      } else if (typeof fingerprint === 'object' && fingerprint !== null) {
        updates.fingerprint = fingerprint;
      }
    }
    
    // Убеждаемся, что userId существует при upsert
    const updateOptions: any = { upsert: true, new: true };
    if (Object.keys(updates).length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No updates provided',
      });
    }
    
    // При upsert убеждаемся, что userId установлен
    const existingUser = await UserModel.findOne({ userId });
    if (!existingUser) {
      updates.userId = userId;
    }
    
    const result = await UserModel.findOneAndUpdate(
      { userId },
      { $set: updates },
      updateOptions
    ).lean() as UserSettingsDocument | null;
    
    return NextResponse.json({
      success: true,
      aiProvider: updates.aiProvider || result?.aiProvider || undefined,
      fingerprintUpdated: fingerprint !== undefined,
      apiKeysUpdated: geminiApiKey !== undefined || openaiApiKey !== undefined,
    });
  } catch (error) {
    console.error('Error updating user settings:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { 
        error: 'Failed to update user settings',
        details: errorMessage 
      },
      { status: 500 }
    );
  }
}

