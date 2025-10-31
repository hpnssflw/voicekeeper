import { BaseService } from '../core/BaseService';
import { BotsRepository } from '../repositories/bots.repo';

export class BotsService extends BaseService {
  private readonly repo = new BotsRepository();

  async resolveTokenByUsername(botUsername: string): Promise<string | null> {
    const bot = await this.repo.findActiveByUsername(botUsername);
    return bot?.tokenPlain || null; // TODO: decrypt if storing encrypted
  }
}


