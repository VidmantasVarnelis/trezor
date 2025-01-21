import { PublicKey } from '@solana/web3.js';
import { getAccountBalance } from '@solana-bot/core';
import { PrismaUserRepository } from '@repo/database/repositories';
import { TelegramService } from '../telegram.service';
import { SUB_MENU, USER_WALLET_SUB_MENU } from '../lib/menus';
import { UserWalletMessages } from '../messages';
import { Config } from '../../../constants';

export class UserWalletCommand {
  constructor(
    private readonly config: Config,
    private readonly telegramService: TelegramService,
    private readonly prismaUserRepository: PrismaUserRepository,
  ) {}

  public async addButtonHandler(chatId: number, messageId: number) {
    const userId = String(chatId);
    const userPersonalWallet = await this.prismaUserRepository.getPersonalWallet(userId);

    if (!userPersonalWallet) {
      return;
    }
    const balance = await getAccountBalance(
      this.config.connection,
      new PublicKey(userPersonalWallet.personalWalletPubKey),
    );

    await this.telegramService.editMessageText(
      chatId,
      messageId,
      UserWalletMessages.userWalletMessage(userPersonalWallet, balance),
      {
        replyMarkup: USER_WALLET_SUB_MENU,
        mode: 'HTML',
      },
    );
  }

  public async showPrivateKey(chatId: number, messageId: number) {
    const userId = String(chatId);

    const userPrivKey = await this.prismaUserRepository.showUserPrivateKey(userId);

    await this.telegramService.editMessageText(
      chatId,
      messageId,
      UserWalletMessages.privateUserWalletMessage(userPrivKey),
      {
        replyMarkup: SUB_MENU,
        mode: 'HTML',
      },
    );
  }
}
