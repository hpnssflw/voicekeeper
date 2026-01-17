import { BaseRepository } from '../core/BaseRepository';
import { BotModel } from '../models/Bot';

export class BotsRepository extends BaseRepository<typeof BotModel> {
  constructor() {
    super('bots');
  }

  async findActiveByUsername(username: string) {
    return BotModel.findOne({ botUsername: username, isActive: true }).lean();
  }

  async findById(id: string) {
    return BotModel.findById(id).lean();
  }
}


