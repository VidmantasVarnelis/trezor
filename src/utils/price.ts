import BN from 'bn.js';
import { PublicKey } from '@solana/web3.js';
import Decimal from 'decimal.js';
import { WSOL } from '@solana-bot/core';
import { convertBNToDecimalAmount } from './solana';

export const calculateRaydiumMintPrice = (
  quoteMint: PublicKey,
  baseReserve: BN,
  baseDecimal: BN,
  quoteReserve: BN,
  quoteDecimal: BN
) => {
  const base = convertBNToDecimalAmount(baseReserve, baseDecimal);
  const quote = convertBNToDecimalAmount(quoteReserve, quoteDecimal);

  if (quoteMint.toString() === WSOL.toString()) {
    return quote.div(base);
  } else {
    return base.div(quote);
  }
};

export const calculateMintMarketCap = (
  mintPrice: Decimal,
  initialSupply: number
) => {
  return mintPrice.mul(initialSupply);
};

export const calculateMintUsdcMarketCap = (
  mintPrice: Decimal,
  initialSupply: number,
  solanaUsdcPrice: number
) => {
  return mintPrice.mul(initialSupply).mul(solanaUsdcPrice);
};
