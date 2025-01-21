import { PrismaSubscriptionRepository, PrismaUserRepository } from '@repo/database/repositories';
import { INSUFFICIENT_BALANCE_SUB_MENU, SUB_MENU, UPGRADE_PLAN_SUB_MENU } from '../lib/menus';
import { TelegramService } from '../telegram.service';
import { GeneralMessages, SubscriptionMessages } from '../messages';
import { ApplicationPlatform, SubscriptionPlan } from '@repo/database';
import { Config, PaymentsMessageEnum } from '../../../constants';
import { PaymentsService } from '../../payments';

export class SubscriptionCommand {
  private readonly paymentsService: PaymentsService;
  constructor(
    private readonly config: Config,
    private readonly telegramService: TelegramService,
    private readonly prismaUserRepository: PrismaUserRepository,
    private readonly prismaSubscriptionRepository: PrismaSubscriptionRepository,
  ) {
    this.paymentsService = new PaymentsService(
      this.config,
      this.prismaUserRepository,
      this.prismaSubscriptionRepository,
    );
  }

  public async addButtonHandler(chatId: number, messageId: number) {
    const userId = chatId.toString();

    const user = await this.prismaUserRepository.getUserPlan(userId, ApplicationPlatform.BOOSTS);

    return this.telegramService.editMessageText(
      chatId,
      messageId,
      SubscriptionMessages.upgradePlanMessage(user, ApplicationPlatform.BOOSTS),
      {
        replyMarkup: UPGRADE_PLAN_SUB_MENU,
        mode: 'HTML',
      },
    );
  }

  public async upgradePlan(chatId: number, messageId: number, plan: SubscriptionPlan) {
    const userId = chatId.toString();

    const { message: subscriptionMessage } = await this.paymentsService.chargeSubscription(
      userId,
      plan,
      ApplicationPlatform.BOOSTS,
    );

    if (subscriptionMessage === PaymentsMessageEnum.PLAN_UPGRADED) {
      return this.telegramService.editMessageText(
        chatId,
        messageId,
        SubscriptionMessages.planUpgradedMessage(plan),
        {
          replyMarkup: SUB_MENU,
          mode: 'HTML',
        },
      );
    } else if (subscriptionMessage === PaymentsMessageEnum.INSUFFICIENT_BALANCE) {
      return this.telegramService.editMessageText(
        chatId,
        messageId,
        GeneralMessages.insufficientBalanceMessage(),
        {
          replyMarkup: INSUFFICIENT_BALANCE_SUB_MENU,
          mode: 'HTML',
        },
      );
    } else if (subscriptionMessage === PaymentsMessageEnum.USER_ALREADY_PAID) {
      return this.telegramService.editMessageText(
        chatId,
        messageId,
        SubscriptionMessages.userAlreadyPaidMessage(),
        {
          replyMarkup: {
            inline_keyboard: UPGRADE_PLAN_SUB_MENU.inline_keyboard.filter(
              (button) => !button[0]?.text.includes(plan),
            ),
          },
          mode: 'HTML',
        },
      );
    } else if (subscriptionMessage === PaymentsMessageEnum.DOWNGRADE_PLAN) {
      return this.telegramService.editMessageText(
        chatId,
        messageId,
        SubscriptionMessages.downgradePaidPlanMessage(),
        {
          replyMarkup: {
            inline_keyboard: UPGRADE_PLAN_SUB_MENU.inline_keyboard.filter(
              (button) => !button[0]?.text.includes(plan),
            ),
          },
          mode: 'HTML',
        },
      );
    } else {
      return this.telegramService.editMessageText(
        chatId,
        messageId,
        GeneralMessages.generalTransactionMessageError(),
        {
          replyMarkup: SUB_MENU,
          mode: 'HTML',
        },
      );
    }
  }
}
