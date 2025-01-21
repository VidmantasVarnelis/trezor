export enum DexScreenerPaidOrdersStatusEnum {
  APPROVED = 'approved',
  PROCESSING = 'processing',
  CANCELLED = 'cancelled',
  ON_HOLD = 'on-hold',
  REJECTED = 'rejected',
}

export enum DexScreenerPaidOrdersTypeEnum {
  TOKEN_PROFILE = 'tokenProfile',
  COMMUNITY_TAKEOVER = 'communityTakeover',
  tokenAd = 'tokenAd',
  trendingBarAd = 'trendingBarAd',
}

export interface IDexScreenerPaidOrders {
  type: DexScreenerPaidOrdersTypeEnum;
  status: DexScreenerPaidOrdersStatusEnum;
}

export interface IDexScreenerLatestBoostedTokens {
  url: string;
  chainId: string;
  tokenAddress: string;
  amount: number;
  totalAmount: number;
  icon?: string;
  header?: string;
  description?: string;
  links: {
    type: string;
    label: string;
    url: string;
  }[];
}
