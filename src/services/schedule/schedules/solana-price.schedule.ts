import { logger } from '@repo/logger';
import { IScheduledTask } from './schedule.interface';
import { Config } from '../../../constants';

export class SolanaPriceSchedule implements IScheduledTask {
  public readonly cronExpression: string = '*/30 * * * *';

  constructor(private readonly config: Config) {}

  public executeTask() {
    this.config
      .updateSolanaUsdcPrice()
      .catch(() => logger.error('Error updating solana usdc price!'));
  }
}
