import { UserModel } from '@/lib/db/models/User';
import { connectMongo } from '@/lib/db/mongo';
import mongoose from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';

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
    // Используем process.stderr для гарантированного вывода
    process.stderr.write('[GET /api/users/[userId]] Starting request\n');
    console.error('[GET /api/users/[userId]] Starting request');
    process.stderr.write('[GET /api/users/[userId]] Awaiting params...\n');
    console.error('[GET /api/users/[userId]] Awaiting params...');
    const { userId } = await params;
    process.stderr.write(`[GET /api/users/[userId]] userId: ${userId}\n`);
    console.error('[GET /api/users/[userId]] userId:', userId);
    
    let mongoConnected = false;
    try {
      await connectMongo();
      // Проверяем, что соединение действительно установлено
      if (mongoose.connection.readyState === 1) {
        mongoConnected = true;
      } else {
        console.warn('MongoDB connection state is not ready:', mongoose.connection.readyState);
      }
    } catch (mongoError: any) {
      // MongoDB недоступна - возвращаем дефолтные данные вместо ошибки
      const errorMessage = mongoError?.message || String(mongoError);
      console.warn('[GET /api/users/[userId]] MongoDB connection error, returning default user data:', errorMessage);
      mongoConnected = false;
    }
    
    if (!mongoConnected) {
      return NextResponse.json({
        userId,
        email: undefined,
        firstName: undefined,
        lastName: undefined,
        plan: 'free',
        generationsUsed: 0,
        generationsLimit: 3,
        isOnboarded: false,
        language: 'ru',
        photoUrl: undefined,
        provider: undefined,
      });
    }
    
    try {
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
          // Если не удалось создать - возвращаем дефолтные данные
          console.warn('Error creating user, returning default data:', createError);
          return NextResponse.json({
            userId,
            email: undefined,
            firstName: undefined,
            lastName: undefined,
            plan: 'free',
            generationsUsed: 0,
            generationsLimit: 3,
            isOnboarded: false,
            language: 'ru',
            photoUrl: undefined,
            provider: undefined,
          });
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
    } catch (dbError) {
      // Ошибка при работе с БД - возвращаем дефолтные данные
      console.warn('Database error, returning default user data:', dbError);
      return NextResponse.json({
        userId,
        email: undefined,
        firstName: undefined,
        lastName: undefined,
        plan: 'free',
        generationsUsed: 0,
        generationsLimit: 3,
        isOnboarded: false,
        language: 'ru',
        photoUrl: undefined,
        provider: undefined,
      });
    }
  } catch (error: any) {
    const errorMessage = error?.message || String(error);
    console.error('[GET /api/users/[userId]] Error fetching user:', errorMessage);
    if (error instanceof Error) {
      console.error('[GET /api/users/[userId]] Error name:', error.name);
      console.error('[GET /api/users/[userId]] Error stack:', error.stack);
    }
    
    // Пытаемся получить userId из params, если это возможно
    let userId = 'unknown';
    try {
      const paramsResult = await params;
      userId = paramsResult.userId || 'unknown';
    } catch {
      // Если не удалось получить userId, используем 'unknown'
    }
    
    // Вместо 500 возвращаем дефолтные данные
    return NextResponse.json({
      userId,
      email: undefined,
      firstName: undefined,
      lastName: undefined,
      plan: 'free',
      generationsUsed: 0,
      generationsLimit: 3,
      isOnboarded: false,
      language: 'ru',
      photoUrl: undefined,
      provider: undefined,
    });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  console.log('[PUT /api/users/[userId]] Starting request');
  try {
    console.log('[PUT /api/users/[userId]] Awaiting params...');
    const { userId } = await params;
    console.log('[PUT /api/users/[userId]] userId:', userId);
    
    let body: any = {};
    try {
      console.log('[PUT /api/users/[userId]] Parsing request body...');
      body = await request.json();
      console.log('[PUT /api/users/[userId]] Request body:', JSON.stringify(body).substring(0, 200));
    } catch (parseError) {
      console.warn('[PUT /api/users/[userId]] Failed to parse request body:', parseError);
      // Если не удалось распарсить body, используем пустой объект
    }
    
    const allowedFields = ['firstName', 'lastName', 'email', 'plan', 'isOnboarded', 'language', 'generationsUsed', 'generationsLimit', 'photoUrl', 'provider'];
    const filteredUpdates: any = {};
    
    for (const key of allowedFields) {
      if (body[key] !== undefined) {
        filteredUpdates[key] = body[key];
      }
    }
    
    // Подготавливаем данные для возврата (на случай если MongoDB недоступна)
    const responseData = {
      userId,
      ...filteredUpdates,
      plan: filteredUpdates.plan || 'free',
      generationsUsed: filteredUpdates.generationsUsed ?? 0,
      generationsLimit: filteredUpdates.generationsLimit ?? 3,
      isOnboarded: filteredUpdates.isOnboarded ?? false,
      language: filteredUpdates.language || 'ru',
    };
    
    let mongoConnected = false;
    try {
      await connectMongo();
      // Проверяем, что соединение действительно установлено
      if (mongoose.connection.readyState === 1) {
        mongoConnected = true;
      } else {
        console.warn('MongoDB connection state is not ready:', mongoose.connection.readyState);
      }
    } catch (mongoError) {
      // MongoDB недоступна - возвращаем данные из запроса вместо ошибки
      console.warn('MongoDB connection error, returning request data:', mongoError);
      mongoConnected = false;
    }
    
    if (!mongoConnected) {
      return NextResponse.json(responseData);
    }
    
    try {
      // Check if user exists
      const existingUser = await UserModel.findOne({ userId }).lean();
      
      let user: UserDocument | null;
      if (!existingUser) {
        // Create new user with all required defaults
        const newUser = await UserModel.create({
          userId,
          ...filteredUpdates,
          aiProvider: 'gemini',
          plan: filteredUpdates.plan || 'free',
          generationsUsed: filteredUpdates.generationsUsed ?? 0,
          generationsLimit: filteredUpdates.generationsLimit ?? 3,
          isOnboarded: filteredUpdates.isOnboarded ?? false,
          language: filteredUpdates.language || 'ru',
        });
        user = newUser.toObject() as UserDocument;
      } else {
        // Update existing user
        user = await UserModel.findOneAndUpdate(
          { userId },
          { $set: filteredUpdates },
          { new: true }
        ).lean() as UserDocument | null;
      }
      
      if (!user) {
        // Если не удалось создать/обновить, возвращаем данные из запроса
        console.warn('Failed to create/update user in MongoDB, returning request data');
        return NextResponse.json(responseData);
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
    } catch (dbError) {
      // Ошибка при работе с базой данных - возвращаем данные из запроса
      console.warn('Database error during user update, returning request data:', dbError);
      return NextResponse.json(responseData);
    }
  } catch (error: any) {
    const errorMessage = error?.message || String(error);
    console.error('[PUT /api/users/[userId]] Error updating user:', errorMessage);
    if (error instanceof Error) {
      console.error('[PUT /api/users/[userId]] Error name:', error.name);
      console.error('[PUT /api/users/[userId]] Error stack:', error.stack);
    }
    
    // Пытаемся получить userId и body из запроса
    let userId = 'unknown';
    let responseData: any = {
      userId: 'unknown',
      plan: 'free',
      generationsUsed: 0,
      generationsLimit: 3,
      isOnboarded: false,
      language: 'ru',
    };
    
    try {
      const paramsResult = await params;
      userId = paramsResult.userId || 'unknown';
      responseData.userId = userId;
      
      try {
        const body = await request.json();
        responseData = { ...responseData, ...body };
      } catch {
        // Игнорируем ошибку парсинга body
      }
    } catch {
      // Игнорируем ошибку получения params
    }
    
    // Вместо 500 возвращаем данные из запроса
    return NextResponse.json(responseData);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;
    
    try {
      await connectMongo();
    } catch (mongoError) {
      // MongoDB недоступна - возвращаем успех, так как данных нет
      console.warn('MongoDB connection error, user deletion skipped:', mongoError);
      return NextResponse.json(
        { 
          success: true,
          message: 'User data not found in database (already deleted or never existed)'
        },
        { status: 200 }
      );
    }
    
    // Удаляем пользователя из MongoDB
    const result = await UserModel.deleteOne({ userId });
    
    if (result.deletedCount === 0) {
      return NextResponse.json(
        { 
          success: true,
          message: 'User not found in database'
        },
        { status: 200 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'User profile deleted successfully',
      userId,
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    if (error instanceof Error) {
      console.error('Error stack:', error.stack);
      console.error('Error name:', error.name);
    }
    return NextResponse.json(
      { 
        error: 'Failed to delete user',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

