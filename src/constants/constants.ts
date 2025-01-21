import { Commitment } from '@solana/web3.js';
import dotenv from 'dotenv';
import { logger } from '@repo/logger';

dotenv.config();

export const retrieveEnvVariable = (variableName: string) => {
  const variable = process.env[variableName] || '';
  if (!variable) {
    logger.error(`${variableName} is not set`);
    process.exit(1);
  }
  return variable;
};

export const BETTER_CALL_SOL_PK = retrieveEnvVariable('BETTER_CALL_SOL_PK');

// rpc endpoints
export const MAINNET_RPC_ENDPOINT = 'https://api.mainnet-beta.solana.com';
export const MAINNET_WEBSOCKET_ENDPOINT = 'wss://api.mainnet-beta.solana.com';
export const RPC_ENDPOINT = retrieveEnvVariable('RPC_ENDPOINT');
export const RPC_WEBSOCKET_ENDPOINT = retrieveEnvVariable(
  'RPC_WEBSOCKET_ENDPOINT'
);

// telegram
export const TELEGRAM_TOKEN = retrieveEnvVariable('TELEGRAM_TOKEN');

//Server
export const TG_WEBHOOK_BASE_URL = retrieveEnvVariable('TG_WEBHOOK_BASE_URL');
export const PORT = Number(retrieveEnvVariable('PORT'));

//DB
export const PULSE_API_KEY = retrieveEnvVariable('PULSE_API_KEY');

export const PRIVATE_KEY = retrieveEnvVariable('PRIVATE_KEY');
export const IS_DEV_ENV = retrieveEnvVariable('NODE_ENV') === 'development';
export const NODE_PATH = retrieveEnvVariable('NODE_PATH');
export const COMMITMENT_LEVEL: Commitment = retrieveEnvVariable(
  'COMMITMENT_LEVEL'
) as Commitment;
export const LOG_LEVEL = retrieveEnvVariable('LOG_LEVEL');
