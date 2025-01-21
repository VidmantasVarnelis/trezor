import { PrismaSubscriptionRepository, PrismaUserRepository } from '@repo/database/repositories';
import { START_MENU } from '../lib/menus';
import { GeneralMessages } from '../messages';
import { TelegramService } from '../telegram.service';
import { ApplicationPlatform } from '@repo/database';
import { Config } from '../../../constants';

export class StartCommand {
  constructor(
    private readonly config: Config,
    private readonly telegramService: TelegramService,
    private readonly prismaUserRepository: PrismaUserRepository,
    private readonly prismaSubscriptionRepository: PrismaSubscriptionRepository,
  ) {}

  public addHandler() {
    this.telegramService.start(async (ctx) => {
      const chatId = ctx.chat.id;
      const firstName = ctx.from.first_name || '';
      const lastName = ctx.from.last_name || '';
      const username = ctx.from.username || '';
      const userId = ctx.chat.id.toString();

      if (!userId) {
        return;
      }

      // Find existing user
      const user = await this.prismaUserRepository.getById(userId);
      const messageText = GeneralMessages.startMessage(
        user,
        ApplicationPlatform.BOOSTS,
        this.config.freeDailyMessages.get(userId)?.count ?? 0,
      );

      await this.telegramService.sendMessage(chatId, messageText, {
        disableLinkPreview: true,
        replyMarkup: START_MENU,
        mode: 'HTML',
      });

      // Create new user
      if (!user) {
        await this.prismaUserRepository.create({
          firstName,
          id: userId,
          lastName,
          username,
        });
      }

      if (!user?.userSubscriptions.find((sub) => sub.platform === ApplicationPlatform.BOOSTS)) {
        await this.prismaSubscriptionRepository.updateUserSubscription(
          userId,
          'FREE',
          ApplicationPlatform.BOOSTS,
        );
      }
    });
  }
}
