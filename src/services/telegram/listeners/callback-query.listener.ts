import { PrismaSubscriptionRepository, PrismaUserRepository } from '@repo/database/repositories';
import { CallbackQuery } from 'telegraf/types';
import { ApplicationPlatform } from '@repo/database';
import { DonateCommand, SubscriptionCommand, UserWalletCommand } from '../commands';
import { GeneralMessages } from '../messages';
import { START_MENU } from '../lib/menus';
import {
  userExpectingDonation,
  userExpectingAddWalletAddress,
  userExpectingDeleteWalletAddress,
} from '../lib/waiting-stage';
import { TelegramService } from '../telegram.service';
import { Config, DonationEnum } from '../../../constants';
import { CallbackQueryDataEnum } from '../constants';

export class CallbackQueryListener {
  private readonly userWalletCommand: UserWalletCommand;
  private readonly subscriptionCommand: SubscriptionCommand;
  private readonly donateCommand: DonateCommand;

  constructor(
    private readonly config: Config,
    private readonly telegramService: TelegramService,
    private readonly prismaUserRepository: PrismaUserRepository,
    private readonly prismaSubscriptionRepository: PrismaSubscriptionRepository,
  ) {
    this.donateCommand = new DonateCommand(
      this.config,
      this.telegramService,
      this.prismaUserRepository,
      this.prismaSubscriptionRepository,
    );
    this.subscriptionCommand = new SubscriptionCommand(
      this.config,
      this.telegramService,
      this.prismaUserRepository,
      this.prismaSubscriptionRepository,
    );
    this.userWalletCommand = new UserWalletCommand(
      this.config,
      this.telegramService,
      this.prismaUserRepository,
    );
  }

  public start() {
    this.telegramService.onCallbackQuery(async (query) => {
      const chatId = query.chat?.id;
      const message = query.callbackQuery.message;

      if (!chatId || !message) {
        return;
      }

      const data = (query.callbackQuery as CallbackQuery & { data: string | undefined }).data;

      try {
        switch (data) {
          case CallbackQueryDataEnum.MY_WALLET:
            await this.userWalletCommand.addButtonHandler(message.chat.id, message.message_id);
            break;
          case CallbackQueryDataEnum.SHOW_PRIVATE_KEY:
            await this.userWalletCommand.showPrivateKey(message.chat.id, message.message_id);
            break;
          case CallbackQueryDataEnum.UPGRADE:
            await this.subscriptionCommand.addButtonHandler(message.chat.id, message.message_id);
            break;
          case CallbackQueryDataEnum.UPGRADE_HOBBY:
            await this.subscriptionCommand.upgradePlan(
              message.chat.id,
              message.message_id,
              'HOBBY',
            );
            break;
          case CallbackQueryDataEnum.UPGRADE_PRO:
            await this.subscriptionCommand.upgradePlan(message.chat.id, message.message_id, 'PRO');
            break;
          case CallbackQueryDataEnum.DONATE:
            await this.donateCommand.addButtonHandler(message.chat.id, message.message_id);
            break;
          case `${CallbackQueryDataEnum.DONATE_ACTION}_${DonationEnum.MINIMUM}`:
            await this.donateCommand.chargeDonation(message.chat.id, DonationEnum.MINIMUM);
            break;
          case `${CallbackQueryDataEnum.DONATE_ACTION}_${DonationEnum.LOW}`:
            await this.donateCommand.chargeDonation(message.chat.id, DonationEnum.LOW);
            break;
          case `${CallbackQueryDataEnum.DONATE_ACTION}_${DonationEnum.MEDIUM}`:
            await this.donateCommand.chargeDonation(message.chat.id, DonationEnum.MEDIUM);
            break;
          case `${CallbackQueryDataEnum.DONATE_ACTION}_${DonationEnum.HIGH}`:
            await this.donateCommand.chargeDonation(message.chat.id, DonationEnum.HIGH);
            break;
          case `${CallbackQueryDataEnum.DONATE_ACTION}_${DonationEnum.PREMIUM}`:
            await this.donateCommand.chargeDonation(message.chat.id, DonationEnum.PREMIUM);
            break;
          case CallbackQueryDataEnum.BACK_TO_MAIN_MENU: {
            const user = await this.prismaUserRepository.getById(chatId.toString());

            userExpectingAddWalletAddress.delete(chatId);
            userExpectingDonation.delete(chatId);
            userExpectingDeleteWalletAddress.delete(chatId);

            await this.telegramService.editMessageText(
              chatId,
              message.message_id,
              GeneralMessages.startMessage(
                user,
                ApplicationPlatform.BOOSTS,
                this.config.freeDailyMessages.get(chatId.toString())?.count ?? 0,
              ),
              {
                replyMarkup: START_MENU,
                mode: 'HTML',
              },
            );

            break;
          }
          default:
            await this.telegramService.sendMessage(chatId, 'Unknown command.');
        }
      } catch {
        await this.telegramService.sendMessage(chatId, GeneralMessages.botInternalServerError());
      }
    });
  }
}
