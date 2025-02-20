import dedent from 'dedent';

export class RateLimitMessages {
  constructor() {}

  public static walletWasPaused(walletAddress: string) {
    const messageText = dedent(`
  Your wallet <code>${walletAddress}</code> is spamming to many txs per second and it will be paused for 2 hours
  `);

    return messageText;
  }

  public static walletWasResumed(walletAddress: string) {
    const messageText = dedent(`
  Your wallet <code>${walletAddress}</code> has been resumed from sleeping after 2 hours!
          `);

    return messageText;
  }

  public static walletWasBanned(walletAddress: string) {
    const messageText = dedent(`
  Your wallet <code>${walletAddress}</code> was banned and no longer being tracked due to hard spamming txs
  `);

    return messageText;
  }
}
