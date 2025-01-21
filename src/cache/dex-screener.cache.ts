import { logger } from '@repo/logger';
import { IDexScreenerLatestBoostedTokens } from '../typings';
import { dexScreenerService } from '../services';

export interface IBoostedTokensCache extends IDexScreenerLatestBoostedTokens {
  createdAt: number;
  updatedAt: number;
  marketCap?: number;
}

export class DexScreenerCache {
  private readonly boostedTokens: Map<string, IBoostedTokensCache> = new Map<
    string,
    IBoostedTokensCache
  >();

  constructor() {}

  public save(mint: string, data: IBoostedTokensCache): void {
    this.boostedTokens.set(mint, data);
  }

  public update(mint: string, data: Partial<IBoostedTokensCache>) {
    const boost = this.boostedTokens.get(mint);
    if (boost) {
      this.boostedTokens.set(mint, { ...boost, ...data });
      return true;
    }
    return false;
  }

  public get(mint: string): IBoostedTokensCache | undefined {
    return this.boostedTokens.get(mint);
  }

  public has(mint: string): boolean {
    return this.boostedTokens.has(mint);
  }

  public remove(mint: string): boolean {
    return this.boostedTokens.delete(mint);
  }

  public values() {
    return this.boostedTokens.values();
  }

  public isExpired(lastModifiedTimestamp: number) {
    const EXPIRATION_PERIOD_MS = 2 * 24 * 60 * 60 * 1000; // 2 days in milliseconds
    const timeSinceUpdate = Date.now() - lastModifiedTimestamp;

    return timeSinceUpdate >= EXPIRATION_PERIOD_MS;
  }

  public async seed() {
    logger.debug('Starting boosts seed!...');
    const boostedTokens = await dexScreenerService.getLatestBoostedTokens();

    for (const boost of boostedTokens) {
      this.save(boost.tokenAddress, { ...boost, createdAt: Date.now(), updatedAt: Date.now() });
    }

    logger.debug(`Seeded ${boostedTokens.length} entries!`);
  }
}
