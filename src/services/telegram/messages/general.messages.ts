import dedent from 'dedent';
import { MAX_FREE_DAILY_MESSAGES } from '../../../constants/pricing';
import { UserPrisma } from '../../../typings';
import { ApplicationPlatform } from '@repo/database';

export class GeneralMessages {
  public static startMessage(
    user: UserPrisma,
    platform: ApplicationPlatform,
    dailyMessages: number,
  ): string {
    const subscription = user?.userSubscriptions?.find((sub) => sub.platform === platform);
    const plan = subscription?.plan || 'FREE';

    const messageText = dedent(`
      Better Call SOL | BOOSTS!
      You're currently on <b>${plan}</b> plan${plan === 'FREE' ? `\nFor Free plan you have every 6 hours ${dailyMessages}/${MAX_FREE_DAILY_MESSAGES} messages` : ''}${dailyMessages === MAX_FREE_DAILY_MESSAGES ? '\n<b>You have reached six hours message limit. Please Upgrade to another plan to continue!</b>' : ''}

      ${plan !== 'PRO' ? `🆙 Upgrade for a <b>PRO</b> plan to get boosts up to 1 month with no limits!` : ''}

      --
      Our other products:
      <a href="https://t.me/BetterCallSOL_LOUNGE">@Better Call SOL | Lounge</a>
      <a href="https://t.me/BetterCallSol_WalletTrackerBot">@Better Call SOL | Wallet Tracker</a>
      <a href="https://t.me/BetterCallSol_InsidersBot">@Better Call SOL | Insiders</a>
`);

    return messageText;
  }

  public static insufficientBalanceMessage(): string {
    const messageText = dedent(`
      ❌ Ooops it seems that you don't have sufficient balance to perform this transaction.

      You can try by adding some <b>SOL</b> to your Better Call SOL personal wallet 
`);

    return messageText;
  }

  public static walletLimitMessageError(
    walletName: string | undefined,
    walletAddress: string,
    planWallets: number,
  ): string {
    const messageText = dedent(`
      ❌ Could not add wallet: <code>${walletName ? walletName : walletAddress}</code>, 

      Wallet limit reached: <b>${planWallets}</b>

      You can try by upgrading your <b>plan</b> for more wallets 💎
`);

    return messageText;
  }

  public static botWalletError(): string {
    const messageText = dedent(`
  🔴 Oops! it seems that this wallet has been banned due to too many tps
`);

    return messageText;
  }

  public static botWalletBadFormatError(): string {
    const messageText = dedent(`
  🔴 Oops! Bad format of wallets!
`);

    return messageText;
  }

  public static botInternalServerError(): string {
    const messageText = dedent(`
  🟡 Better Call SOL Unexpected issue!

We have encountered an unexpected issue affecting the Better Call SOL. We sincerely apologize for any inconvenience this may cause
`);

    return messageText;
  }

  public static botUnavailableError(): string {
    const messageText = dedent(`
  🔴 Better Call SOL is Currently Unavailable!

We regret to inform you that Better Call SOL is temporarily down. We sincerely apologize for any inconvenience this may cause and appreciate your understanding as we work diligently to resolve the issue.

Thank you for your patience. We will provide updates as soon as the service is restored.

— The Better Call SOL Team
`);

    return messageText;
  }

  public static generalTransactionMessageError(): string {
    const messageText = dedent(`
    🟡 Ooops it seems that something went wrong while processing the transaction.

    You probaly don't have sufficient balance in your wallet

    Maybe try adding some <b>SOL</b> to your better call sol personal wallet!
`);

    return messageText;
  }
}
