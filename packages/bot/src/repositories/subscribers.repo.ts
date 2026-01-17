import { Types } from 'mongoose';
import { BaseRepository } from '../core/BaseRepository';
import { BotSubscriberModel } from '../models/BotSubscriber';

export class SubscribersRepository extends BaseRepository<typeof BotSubscriberModel> {
  constructor() {
    super('bot_subscribers');
  }

  async findActiveByBotId(botId: string) {
    return BotSubscriberModel.find({
      botId: new Types.ObjectId(botId),
      status: 'active',
    }).lean();
  }

  async createOrUpdate(botId: string, telegramId: number, data: any = {}) {
    return BotSubscriberModel.findOneAndUpdate(
      { botId: new Types.ObjectId(botId), telegramId },
      {
        ...data,
        botId: new Types.ObjectId(botId),
        telegramId,
        status: 'active',
        lastActivityAt: new Date(),
        $setOnInsert: { joinedAt: new Date() },
      },
      { upsert: true, new: true }
    ).lean();
  }
}

