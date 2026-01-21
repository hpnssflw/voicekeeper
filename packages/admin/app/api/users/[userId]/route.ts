import { NextRequest, NextResponse } from 'next/server';
import { connectMongo } from '@/lib/db/mongo';
import { UserModel } from '@/lib/db/models/User';

interface UserDocument {
  userId: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  plan?: string;
  generationsUsed?: number;
  generationsLimit?: number;
  isOnboarded?: boolean;
  language?: string;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;
    
    try {
      await connectMongo();
    } catch (mongoError) {
      console.error('MongoDB connection error:', mongoError);
      return NextResponse.json(
        { 
          error: 'Database connection failed',
          details: mongoError instanceof Error ? mongoError.message : 'Unknown error'
        },
        { status: 503 }
      );
    }
    
    let user = await UserModel.findOne({ userId }).lean() as UserDocument | null;
    
    // If user doesn't exist, create default user
    if (!user) {
      try {
        const newUser = await UserModel.create({
          userId,
          plan: 'free',
          generationsLimit: 3,
          generationsUsed: 0,
          isOnboarded: false,
          aiProvider: 'gemini',
        });
        user = newUser.toObject() as UserDocument;
      } catch (createError) {
        console.error('Error creating user:', createError);
        return NextResponse.json(
          { 
            error: 'Failed to create user',
            details: createError instanceof Error ? createError.message : 'Unknown error'
          },
          { status: 500 }
        );
      }
    }
    
    return NextResponse.json({
      userId: user.userId,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      plan: user.plan || 'free',
      generationsUsed: user.generationsUsed || 0,
      generationsLimit: user.generationsLimit || 3,
      isOnboarded: user.isOnboarded || false,
      language: user.language || 'ru',
      photoUrl: (user as any).photoUrl,
      provider: (user as any).provider,
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch user',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
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
    
    try {
      await connectMongo();
    } catch (mongoError) {
      console.error('MongoDB connection error:', mongoError);
      return NextResponse.json(
        { 
          error: 'Database connection failed',
          details: mongoError instanceof Error ? mongoError.message : 'Unknown error'
        },
        { status: 503 }
      );
    }
    
    const allowedFields = ['firstName', 'lastName', 'email', 'plan', 'isOnboarded', 'language', 'generationsUsed', 'generationsLimit', 'photoUrl', 'provider'];
    const filteredUpdates: any = {};
    
    for (const key of allowedFields) {
      if (body[key] !== undefined) {
        filteredUpdates[key] = body[key];
      }
    }
    
    const user = await UserModel.findOneAndUpdate(
      { userId },
      { $set: filteredUpdates },
      { upsert: true, new: true }
    ).lean() as UserDocument | null;
    
    if (!user) {
      return NextResponse.json(
        { error: 'Failed to update user' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      userId: user.userId,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      plan: user.plan || 'free',
      generationsUsed: user.generationsUsed || 0,
      generationsLimit: user.generationsLimit || 3,
      isOnboarded: user.isOnboarded || false,
      language: user.language || 'ru',
      photoUrl: (user as any).photoUrl,
      provider: (user as any).provider,
    });
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { 
        error: 'Failed to update user',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

