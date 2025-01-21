import {
  AMM_V4,
  liquidityStateV4Layout,
  struct,
  u64,
} from '@raydium-io/raydium-sdk-v2';
import { logger } from '@repo/logger';
import { Connection, PublicKey } from '@solana/web3.js';

export const DECIMALS_LAYOUT = struct([
  u64('baseDecimal'),
  u64('quoteDecimal'),
]);

export const fetchMarketAccounts = async (
  connection: Connection,
  tokenA: PublicKey,
  tokenB: PublicKey
) => {
  const DATA_SLICE_CONFIG = {
    layout: DECIMALS_LAYOUT,
    offset: 'baseDecimal',
  };

  try {
    const accounts = await connection.getProgramAccounts(
      AMM_V4, // Program ID for the Raydium AMM V4
      {
        commitment: connection.commitment,
        dataSlice: {
          offset: liquidityStateV4Layout.offsetOf(DATA_SLICE_CONFIG.offset),
          length: DATA_SLICE_CONFIG.layout.span,
        },
        filters: [
          { dataSize: liquidityStateV4Layout.span }, // Filters by the size of the liquidity state layout
          {
            memcmp: {
              offset: liquidityStateV4Layout.offsetOf('baseMint'),
              bytes: tokenA.toBase58(),
            },
          },
          {
            memcmp: {
              // Memory comparison filter to match the tokenB mint
              offset: liquidityStateV4Layout.offsetOf('quoteMint'), // Offset for the tokenB mint in the layout
              bytes: tokenB.toBase58(),
            },
          },
        ],
      }
    );

    const [rawData] = accounts.map(({ pubkey, account }) => ({
      id: pubkey.toString(),
      data: DATA_SLICE_CONFIG.layout.decode(account.data),
    }));

    return rawData;
  } catch (error) {
    logger.error(
      `Error fetching market accounts: ${tokenA.toString()} - ${tokenB.toString()}`
    );
  }
};
