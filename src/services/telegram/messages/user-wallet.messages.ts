import { User } from '@repo/database';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import dedent from 'dedent';

export class UserWalletMessages {
  public static userWalletMessage(
    wallet: Pick<User, 'personalWalletPrivKey' | 'personalWalletPubKey'>,
    balance?: number,
  ) {
    const responseText = dedent(`
        <b>Your wallet address:</b> 
        <code>${wallet.personalWalletPubKey}</code>

        <b>SOL:</b> ${balance ? balance / LAMPORTS_PER_SOL : 0}
`);

    return responseText;
  }

  public static privateUserWalletMessage(privateKey?: string) {
    const responseText = dedent(`
     Your private key (do not share with anyone!!!)

    (Click to copy)
    <code>${privateKey ? privateKey : 'unknown'}</code>
`);

    return responseText;
  }
}
