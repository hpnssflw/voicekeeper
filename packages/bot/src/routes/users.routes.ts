import { Router } from 'express';
import { UserModel } from '../models/User';

export const usersRouter = Router();

/**
 * Get user data
 * GET /api/users/:userId
 */
usersRouter.get('/:userId', async (req, res, next) => {
  try {
    const { userId } = req.params;
    
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
    
    return res.json({
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
    next(error);
  }
});

/**
 * Update user data
 * PUT /api/users/:userId
 * Body: { firstName?, lastName?, email?, plan?, isOnboarded?, language? }
 */
usersRouter.put('/:userId', async (req, res, next) => {
  try {
    const { userId } = req.params;
    const updates = req.body;
    
    const allowedFields = ['firstName', 'lastName', 'email', 'plan', 'isOnboarded', 'language', 'generationsUsed', 'generationsLimit'];
    const filteredUpdates: any = {};
    
    for (const key of allowedFields) {
      if (updates[key] !== undefined) {
        filteredUpdates[key] = updates[key];
      }
    }
    
    const user = await UserModel.findOneAndUpdate(
      { userId },
      { $set: filteredUpdates },
      { upsert: true, new: true }
    ).lean();
    
    return res.json({
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
    next(error);
  }
});

/**
 * Get user settings (API keys, fingerprint, etc.)
 * GET /api/users/:userId/settings
 */
usersRouter.get('/:userId/settings', async (req, res, next) => {
  try {
    const { userId } = req.params;
    
    const user = await UserModel.findOne({ userId }).lean();
    
    if (!user) {
      return res.json({
        aiProvider: 'gemini',
        fingerprint: null,
        hasGeminiKey: false,
        hasOpenAiKey: false,
      });
    }
    
    return res.json({
      aiProvider: user.aiProvider || 'gemini',
      fingerprint: user.fingerprint || null,
      hasGeminiKey: !!user.geminiApiKey,
      hasOpenAiKey: !!user.openaiApiKey,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * Update user settings (API keys, fingerprint, etc.)
 * PUT /api/users/:userId/settings
 * Body: { aiProvider?, geminiApiKey?, openaiApiKey?, fingerprint? }
 */
usersRouter.put('/:userId/settings', async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { aiProvider, geminiApiKey, openaiApiKey, fingerprint } = req.body;
    
    const updates: any = {};
    
    if (aiProvider) {
      updates.aiProvider = aiProvider;
    }
    
    if (geminiApiKey !== undefined) {
      if (geminiApiKey === null || geminiApiKey === '') {
        updates.geminiApiKey = null;
      } else {
        updates.geminiApiKey = geminiApiKey; // In production, encrypt this!
      }
    }
    
    if (openaiApiKey !== undefined) {
      if (openaiApiKey === null || openaiApiKey === '') {
        updates.openaiApiKey = null;
      } else {
        updates.openaiApiKey = openaiApiKey; // In production, encrypt this!
      }
    }
    
    if (fingerprint !== undefined) {
      updates.fingerprint = fingerprint || null;
    }
    
    await UserModel.findOneAndUpdate(
      { userId },
      { $set: updates },
      { upsert: true, new: true }
    );
    
    return res.json({
      success: true,
      aiProvider: aiProvider || undefined,
      fingerprintUpdated: fingerprint !== undefined,
      apiKeysUpdated: geminiApiKey !== undefined || openaiApiKey !== undefined,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * Get API key (returns the key for client-side use)
 * GET /api/users/:userId/api-key?provider=gemini|openai
 * Note: In production, this should be encrypted or use server-side proxy
 */
usersRouter.get('/:userId/api-key', async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { provider } = req.query;
    
    if (!provider || (provider !== 'gemini' && provider !== 'openai')) {
      return res.status(400).json({ error: 'Provider must be gemini or openai' });
    }
    
    const user = await UserModel.findOne({ userId }).lean();
    
    if (!user) {
      return res.json({ hasKey: false, key: null });
    }
    
    const apiKey = provider === 'gemini' ? user.geminiApiKey : user.openaiApiKey;
    
    return res.json({ 
      hasKey: !!apiKey,
      key: apiKey || null,
    });
  } catch (error) {
    next(error);
  }
});

