import { Connection } from '@solana/web3.js';
import { Mutex } from 'async-mutex';
import {
  MAINNET_RPC_ENDPOINT,
  MAINNET_WEBSOCKET_ENDPOINT,
  RPC_ENDPOINT,
  RPC_WEBSOCKET_ENDPOINT,
} from './constants';
import { logger } from '@repo/logger';
import { getSolanaUsdcPrice } from '@solana-bot/core';

export class Config {
  public readonly connection: Connection;
  public readonly mainNetConnection: Connection;
  public readonly runTimestamp: number;
  public readonly mutex: Mutex;
  public solanaUsdcPrice: number = 0;
  public readonly freeDailyMessages: Map<
    string,
    {
      count: number;
      maxMessagesNotifiedAt?: Date;
    }
  > = new Map();

  constructor() {
    this.connection = new Connection(RPC_ENDPOINT, {
      wsEndpoint: RPC_WEBSOCKET_ENDPOINT,
      commitment: 'confirmed',
    });
    this.mainNetConnection = new Connection(MAINNET_RPC_ENDPOINT, {
      wsEndpoint: MAINNET_WEBSOCKET_ENDPOINT,
      commitment: 'confirmed',
    });
    this.runTimestamp = Math.floor(new Date().getTime() / 1000);
    this.mutex = new Mutex();
  }

  public async updateSolanaUsdcPrice() {
    const price = await getSolanaUsdcPrice(this.mainNetConnection);
    logger.info(`SOLANA PRICE: ${price}`);
    this.solanaUsdcPrice = price;
    return price;
  }
}
