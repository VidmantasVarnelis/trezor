import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import { InlineKeyboardMarkup } from 'telegraf/types';
import { DonationEnum, HOBBY_PLAN_FEE, PRO_PLAN_FEE } from '../../../constants';
import { CallbackQueryDataEnum } from '../constants';

export const START_MENU: InlineKeyboardMarkup = {
  inline_keyboard: [
    [
      { text: '👛 My Wallet', callback_data: 'my_wallet' },
      { text: '❤️ Donate', callback_data: 'donate' },
    ],
    [{ text: '👑 Upgrade', callback_data: 'upgrade' }],
  ],
};

export const SUB_MENU: InlineKeyboardMarkup = {
  inline_keyboard: [[{ text: '🔙 Back', callback_data: CallbackQueryDataEnum.BACK_TO_MAIN_MENU }]],
};

export const TX_SUB_MENU: InlineKeyboardMarkup = {
  inline_keyboard: [[{ text: 'Buy on GMGN', callback_data: 'buy_on_gmgn' }]],
};

export const createTxSubMenu = (tokenSymbol: string, tokenMint: string) => {
  const txSubMenu: InlineKeyboardMarkup = {
    inline_keyboard: [
      [
        {
          text: `🐴 Buy on Trojan: ${tokenSymbol}`,
          url: `https://t.me/solana_trojanbot?start=r-bh00000000000-${tokenMint}`,
        },
      ],
      [
        {
          text: `🍌 Banana Bot: ${tokenSymbol}`,
          url: `https://t.me/BananaGunSolana_bot?start=snp_rickburpbot_${tokenMint}`,
        },
        {
          text: `🐶 BonkBot: ${tokenSymbol}`,
          url: `https://t.me/bonkbot_bot?start=ref_3au54_ca_${tokenMint}`,
        },
      ],
    ],
  };

  return txSubMenu;
};

export const UPGRADE_PLAN_SUB_MENU: InlineKeyboardMarkup = {
  inline_keyboard: [
    [
      {
        text: `BUY HOBBY ${HOBBY_PLAN_FEE / LAMPORTS_PER_SOL} SOL 7-days`,
        callback_data: CallbackQueryDataEnum.UPGRADE_HOBBY,
      },
    ],
    [
      {
        text: `BUY PRO ${PRO_PLAN_FEE / LAMPORTS_PER_SOL} SOL 30-days`,
        callback_data: CallbackQueryDataEnum.UPGRADE_PRO,
      },
    ],
    [{ text: '🔙 Back', callback_data: CallbackQueryDataEnum.BACK_TO_MAIN_MENU }],
  ],
};

export const DONATE_MENU: InlineKeyboardMarkup = {
  inline_keyboard: [
    [
      {
        text: `❤️ ${DonationEnum.MINIMUM} SOL`,
        callback_data: `${CallbackQueryDataEnum.DONATE_ACTION}_${DonationEnum.MINIMUM}`,
      },
    ],
    [
      {
        text: `✨ ${DonationEnum.LOW} SOL`,
        callback_data: `${CallbackQueryDataEnum.DONATE_ACTION}_${DonationEnum.LOW}`,
      },
    ],
    [
      {
        text: `💪 ${DonationEnum.MEDIUM} SOL`,
        callback_data: `${CallbackQueryDataEnum.DONATE_ACTION}_${DonationEnum.MEDIUM}`,
      },
    ],
    [
      {
        text: `🗿 ${DonationEnum.HIGH} SOL`,
        callback_data: `${CallbackQueryDataEnum.DONATE_ACTION}_${DonationEnum.HIGH}`,
      },
    ],
    [
      {
        text: `🔥 ${DonationEnum.PREMIUM} SOL`,
        callback_data: `${CallbackQueryDataEnum.DONATE_ACTION}_${DonationEnum.PREMIUM}`,
      },
    ],
    [{ text: '🔙 Back', callback_data: CallbackQueryDataEnum.BACK_TO_MAIN_MENU }],
  ],
};

export const INSUFFICIENT_BALANCE_SUB_MENU: InlineKeyboardMarkup = {
  inline_keyboard: [
    [{ text: '👝 Your Better Cal SOL Wallet', callback_data: CallbackQueryDataEnum.MY_WALLET }],
    [{ text: '🔙 Back', callback_data: CallbackQueryDataEnum.BACK_TO_MAIN_MENU }],
  ],
};

export const USER_WALLET_SUB_MENU: InlineKeyboardMarkup = {
  inline_keyboard: [
    [
      {
        text: '🔑 Show private key',
        callback_data: CallbackQueryDataEnum.SHOW_PRIVATE_KEY,
      },
    ],
    [{ text: '🔙 Back', callback_data: CallbackQueryDataEnum.BACK_TO_MAIN_MENU }],
  ],
};

export const generateQuickLinks = (mint: string) => {
  const links = [
    `<a href="https://pump.fun/${mint}">PF</a>`,
    `<a href="https://t.me/BananaGunSolana_bot?start=snp_rickburpbot_${mint}">BAN</a>`,
    `<a href="https://t.me/diomedes_trojanbot?start=r-bh00000000000-${mint}">TROJ</a>`,
    `<a href="https://bullx.io/terminal?chainId=1399811149&address=${mint}">BULLX</a>`,
    `<a href="https://photon-sol.tinyastro.io/en/lp/${mint}">PHO</a>`,
    `<a href="https://dexscreener.com/solana/${mint}">DEX</a>`,
    `<a href="https://rugcheck.xyz/tokens/${mint}">RUG</a>`,
    `<a href="https://t.me/Phanes_bot?start=price_${mint}">PHN</a>`,
    `<a href="https://t.me/TrenchyBot?start=${mint}">TRH</a>`,
    `<a href="https://solscan.io/token/${mint}">SOL</a>`,
  ];

  return links.join(' | ');
};
