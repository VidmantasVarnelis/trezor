import dedent from 'dedent';
import { FormatNumbers } from '@solana-bot/core';

import { generateQuickLinks } from '../lib/menus';
import { IDexScreenerLatestBoostedTokens } from '../../../typings';
import { ApiV3PoolInfoItemWithMarketCap } from '../../schedule';

export class BoostsMessages {
  public static boostMessage(
    boostedToken: IDexScreenerLatestBoostedTokens,
    poolInfo?: ApiV3PoolInfoItemWithMarketCap,
  ): string {
    const solScanMintUrl = `https://solscan.io/token/${boostedToken.tokenAddress}`;
    const marketCap = poolInfo?.marketCap
      ? FormatNumbers.formatMarketCap(poolInfo.marketCap)
      : undefined;

    const messageText = dedent(`
    🚀 <b>BOOSTED TOKEN ${poolInfo?.mintTokenInfo.symbol ?? ''}</b>  🚀

    <a href="${solScanMintUrl}">${boostedToken.tokenAddress}</a>
    Boosted for <b>${boostedToken.amount}</b> ${marketCap ? `at $${marketCap} MCAP` : ''} 
    Total boost amount <b>${boostedToken.totalAmount}</b>

    ${generateQuickLinks(boostedToken.tokenAddress)}
`);

    return messageText;
  }
}
