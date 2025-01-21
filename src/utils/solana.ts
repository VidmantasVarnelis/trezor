import { WSOL } from '@solana-bot/core';
import BN from 'bn.js';
import Decimal from 'decimal.js';

export const convertBNToDecimalAmount = (amount: BN, decimals: BN) => {
  return new Decimal(amount.toString()).div(new Decimal(10).pow(decimals.toNumber()));
};

export const isWSOL = (mint = ''): boolean => mint === WSOL.toString();
