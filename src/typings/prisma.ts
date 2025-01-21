import { ApplicationPlatform, Prisma, SubscriptionPlan, WalletStatus } from '@repo/database';

export type UserPrisma = {
  userSubscriptions:
    | {
        plan: SubscriptionPlan;
        platform: ApplicationPlatform;
      }[]
    | null;
  id: string;
  hasDonated: boolean;
  personalWalletPubKey: string;
  personalWalletPrivKey: string;
  _count: {
    userWallets: number;
  };
} | null;

export type UserWallet = {
  wallet: {
    id: string;
    address: string;
  };
  userId: string;
  walletId: string;
  name: string;
  walletStatus: WalletStatus;
};

export type UserWithSubscriptionPlan = {
  personalWalletPubKey: string;
  userSubscriptions: {
    plan: SubscriptionPlan;
    platform: ApplicationPlatform;
    subscriptionCurrentPeriodEnd: Date | null;
  }[];
};

export type WalletWithUsers = Prisma.WalletGetPayload<{
  include: {
    userWallets: {
      include: {
        user: {
          select: {
            id: true;
          };
        };
      };
    };
  };
}>;
