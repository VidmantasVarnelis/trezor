import { SubscriptionPlan } from '@repo/database';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';

export const MAX_HOBBY_PERIOD = 7;
export const MAX_PRO_PERIOD = 30;

export const HOBBY_PLAN_FEE = 0.15 * LAMPORTS_PER_SOL;
export const PRO_PLAN_FEE = 0.3 * LAMPORTS_PER_SOL;

export const PROMOTION_PRICE = 0.1;

export const MAX_FREE_DAILY_MESSAGES = 6;

export enum PaymentsMessageEnum {
  NO_USER_FOUND = 'NO_USER_FOUND',
  INSUFFICIENT_BALANCE = 'INSUFFICIENT_BALANCE',
  INVALID_PLAN = 'INVALID_PLAN',
  PLAN_UPGRADED = 'PLAN_UPGRADED',
  DONATION_MADE = 'DONATION_MADE',
  INTERNAL_ERROR = 'INTERNAL_ERROR',
  USER_ALREADY_PAID = 'USER_ALREADY_PAID',
  DOWNGRADE_PLAN = 'DOWNGRADE_PLAN',
  TRANSACTION_SUCCESS = 'TRANSACTION_SUCCESS',
}

export const SUBSCRIPTION_HIERARCHY: { [key in SubscriptionPlan]: number } = {
  FREE: 0,
  HOBBY: 1,
  PRO: 2,
  WHALE: 3,
};

export enum DonationEnum {
  MINIMUM = 0.1,
  LOW = 0.5,
  MEDIUM = 1.0,
  HIGH = 5,
  PREMIUM = 10,
}
