import { NextRequest, NextResponse } from 'next/server';
import { connectMongo } from '@/lib/db/mongo';
import { UserModel } from '@/lib/db/models/User';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;
    await connectMongo();
    
    let user = await UserModel.findOne({ userId }).lean();
    
    // If user doesn't exist, create default user
    if (!user) {
      const newUser = await UserModel.create({
        userId,
        plan: 'free',
        generationsLimit: 3,
        generationsUsed: 0,
        isOnboarded: false,
        aiProvider: 'gemini',
      });
      user = newUser.toObject();
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
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user' },
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
    await connectMongo();
    
    const allowedFields = ['firstName', 'lastName', 'email', 'plan', 'isOnboarded', 'language', 'generationsUsed', 'generationsLimit'];
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
    ).lean();
    
    return NextResponse.json({
      userId: user?.userId,
      email: user?.email,
      firstName: user?.firstName,
      lastName: user?.lastName,
      plan: user?.plan || 'free',
      generationsUsed: user?.generationsUsed || 0,
      generationsLimit: user?.generationsLimit || 3,
      isOnboarded: user?.isOnboarded || false,
      language: user?.language || 'ru',
    });
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { error: 'Failed to update user' },
      { status: 500 }
    );
  }
}

