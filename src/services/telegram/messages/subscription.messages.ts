import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import dedent from 'dedent';
import {
  HOBBY_PLAN_FEE,
  MAX_FREE_DAILY_MESSAGES,
  MAX_HOBBY_PERIOD,
  MAX_PRO_PERIOD,
  PRO_PLAN_FEE,
} from '../../../constants';
import { UserWithSubscriptionPlan } from '../../../typings';
import { ApplicationPlatform, SubscriptionPlan } from '@repo/database';

export class SubscriptionMessages {
  public static upgradePlanMessage(
    user: UserWithSubscriptionPlan | null,
    platform: ApplicationPlatform,
  ): string {
    const subscription = user?.userSubscriptions.find((sub) => sub.platform === platform);

    const subscriptionPlan = subscription?.plan ?? 'FREE';

    const messageText = dedent(`
Current plan: ${subscriptionPlan === 'FREE' ? `<b>${subscriptionPlan}</b>` : `<b>${subscriptionPlan}</b> ${subscription && subscription.plan !== 'FREE' && subscription.subscriptionCurrentPeriodEnd ? `ends on ${subscription.subscriptionCurrentPeriodEnd.toLocaleDateString()}` : ''}`}

These are the plans available:

<b>FREE</b>: ${MAX_FREE_DAILY_MESSAGES} messages - <b>FREE</b> 
<b>HOBBY</b>: 7-days - ${HOBBY_PLAN_FEE / LAMPORTS_PER_SOL} <b>SOL</b> 
<b>PRO</b>: 30-days - ${PRO_PLAN_FEE / LAMPORTS_PER_SOL} <b>SOL</b> 

How can you upgrade your plan?

1. Transfer the required <b>SOL</b> to your <b>BETTER CALL SOL</b> wallet: <code>${user?.personalWalletPubKey}</code>
2. Now you can select one of the plans below!
`);

    return messageText;
  }

  public static planUpgradedMessage(plan: SubscriptionPlan): string {
    const planPeriod: { [key: string]: number } = {
      HOBBY: MAX_HOBBY_PERIOD,
      PRO: MAX_PRO_PERIOD,
    };

    const period = planPeriod[plan];

    const messageText = dedent(`
    ✅ Success! Your plan has been upgraded to <b>${plan}</b>.

    You can now listen up to <b>${period}</b> days!
`);

    return messageText;
  }

  public static userAlreadyPaidMessage(): string {
    const messageText = dedent(`
    🤝 You already purchased this plan! Select different plan to proceed! 
`);

    return messageText;
  }

  public static downgradePaidPlanMessage(): string {
    const messageText = dedent(`
    🤝 You already have plan which is higher tier! Select different plan to proceed! 
`);

    return messageText;
  }
}
