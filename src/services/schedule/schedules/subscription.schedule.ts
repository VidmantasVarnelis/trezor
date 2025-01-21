import { logger } from '@repo/logger';
import { PrismaSubscriptionRepository, PrismaUserRepository } from '@repo/database/repositories';
import { ApplicationPlatform } from '@repo/database';
import { IScheduledTask } from './schedule.interface';
import { Config } from '../../../constants';
import { PaymentsService } from '../../payments';

export class SubscriptionSchedule implements IScheduledTask {
  public readonly cronExpression: string = '0 0 * * *';
  private readonly payments: PaymentsService;

  constructor(
    private readonly config: Config,
    private readonly prismaUserRepository: PrismaUserRepository,
    private readonly prismaSubscriptionRepository: PrismaSubscriptionRepository,
  ) {
    this.payments = new PaymentsService(
      this.config,
      this.prismaUserRepository,
      this.prismaSubscriptionRepository,
    );
  }

  public async executeTask(): Promise<void> {
    logger.debug('Charging subscriptions');

    const usersToCharge = await this.prismaUserRepository.getUsersWithDue(
      ApplicationPlatform.BOOSTS,
    );

    if (usersToCharge.length === 0) {
      logger.debug('No users to charge today');
      return;
    }

    for (const user of usersToCharge) {
      try {
        logger.debug(`Charging user with ID: ${user.userId}`);

        const chargeResult = await this.payments.chargeSubscription(
          user.id,
          user.plan,
          ApplicationPlatform.BOOSTS,
        );

        if (chargeResult.success) {
          logger.info(
            `Successfully charged user ${user.userId} and updated subscription to next period ending on ${chargeResult.subscriptionEnd}.`,
          );
        } else {
          logger.info(
            `Failed to charge user ${user.userId}: ${chargeResult.message} Converting plan to FREE`,
          );
          await this.prismaSubscriptionRepository.cancelUserSubscription(
            user.userId,
            ApplicationPlatform.BOOSTS,
          );
        }
      } catch {
        logger.error('Failed to update subscription with due!');
      }
    }
  }
}
