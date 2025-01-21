import { PrismaSubscriptionRepository, PrismaUserRepository } from '@repo/database/repositories';
import { ApplicationPlatform } from '@repo/database';
import { DONATE_MENU, SUB_MENU } from '../lib/menus';
import { GeneralMessages, DonateMessages } from '../messages';
import { userExpectingDonation } from '../lib/waiting-stage';
import { TelegramService } from '../telegram.service';
import { PaymentsService } from '../../payments';
import { Config, PaymentsMessageEnum } from '../../../constants';

export class DonateCommand {
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
    await this.donate({ chatId, messageId });
  }

  public async chargeDonation(chatId: number, donation: number) {
    const { message: paymentMessage } = await this.paymentsService.chargeDonation(
      chatId.toString(),
      donation,
    );

    if (paymentMessage === PaymentsMessageEnum.INSUFFICIENT_BALANCE) {
      await this.telegramService.sendMessage(chatId, GeneralMessages.insufficientBalanceMessage(), {
        replyMarkup: SUB_MENU,
        mode: 'HTML',
      });
    } else if (paymentMessage === PaymentsMessageEnum.DONATION_MADE) {
      await this.telegramService.sendMessage(chatId, DonateMessages.donationMadeMessage(), {
        replyMarkup: SUB_MENU,
        mode: 'HTML',
      });
    } else {
      await this.telegramService.sendMessage(
        chatId,
        GeneralMessages.generalTransactionMessageError(),
        {
          replyMarkup: SUB_MENU,
          mode: 'HTML',
        },
      );
    }
    userExpectingDonation.delete(chatId);
  }

  private listen() {
    this.telegramService.use(async (ctx, next) => {
      if (!ctx.message || !ctx.chat) {
        return next();
      }
      if (!userExpectingDonation.has(ctx.message.chat.id)) {
        return next();
      }

      const isValidNumber = !isNaN(Number(ctx.text)) && ctx.text?.trim() !== '';

      if (!isValidNumber) {
        await this.telegramService.sendMessage(ctx.chat.id, 'Please enter a valid amount', {
          replyMarkup: SUB_MENU,
          mode: 'HTML',
        });
        return;
      }

      const amount = Number(ctx.text);

      await this.chargeDonation(ctx.chat.id, amount);
    });
  }

  private async donate({ chatId, messageId }: { chatId: number; messageId: number }) {
    const user = await this.prismaUserRepository.getUserPlan(
      chatId.toString(),
      ApplicationPlatform.BOOSTS,
    );

    const userWallet = user?.personalWalletPubKey;

    await this.telegramService.editMessageText(
      chatId,
      messageId,
      DonateMessages.donateMessage(userWallet),
      {
        replyMarkup: DONATE_MENU,
        mode: 'HTML',
      },
    );

    userExpectingDonation.add(chatId);
    this.listen();
  }
}
