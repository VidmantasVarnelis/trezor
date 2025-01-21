import axios, { AxiosInstance } from 'axios';
import {
  DexScreenerPaidOrdersStatusEnum,
  IDexScreenerLatestBoostedTokens,
  IDexScreenerPaidOrders,
} from '../../typings';

export class DexScreenerService {
  private readonly httpClient: AxiosInstance;
  private readonly BASE_URL = 'https://api.dexscreener.com/';

  constructor() {
    this.httpClient = axios.create({
      baseURL: this.BASE_URL,
    });
  }

  public async getTokenPaidOrders(token: string) {
    return (
      await this.httpClient.get<IDexScreenerPaidOrders[]>(
        `orders/v1/solana/${token}`
      )
    ).data;
  }

  public async getLatestBoostedTokens() {
    return (
      await this.httpClient.get<IDexScreenerLatestBoostedTokens[]>(
        'token-boosts/latest/v1'
      )
    ).data;
  }

  public async checkDexPaid(token: string) {
    try {
      const orders = await this.getTokenPaidOrders(token);
      const isPaid = orders.find(
        (order) => order.status === DexScreenerPaidOrdersStatusEnum.APPROVED
      );
      return !!isPaid;
    } catch (error) {
      return false;
    }
  }
}

export const dexScreenerService = new DexScreenerService();
