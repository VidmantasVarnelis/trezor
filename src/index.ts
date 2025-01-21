import { PrismaSubscriptionRepository, PrismaUserRepository } from '@repo/database/repositories';
import { logger } from '@repo/logger';
import { Raydium } from '@raydium-io/raydium-sdk-v2';
import { Config } from './constants';
import { StartCommand } from './services/telegram/commands';
import {
  BoostsSchedule,
  CallbackQueryListener,
  CronScheduleService,
  SolanaPriceSchedule,
  SubscriptionSchedule,
  TelegramService,
} from './services';
import { DexScreenerCache } from './cache';

class DexBoosts {
  private readonly config: Config;
  private readonly telegramService: TelegramService;
  private readonly prismaUserRepository: PrismaUserRepository;
  private readonly prismaSubscriptionRepository: PrismaSubscriptionRepository;
  private readonly dexScreenerCache: DexScreenerCache;

  constructor() {
    this.config = new Config();
    this.telegramService = new TelegramService();
    this.prismaUserRepository = new PrismaUserRepository();
    this.prismaSubscriptionRepository = new PrismaSubscriptionRepository();
    this.dexScreenerCache = new DexScreenerCache();
  }

  public async start() {
    try {
      await this.config.updateSolanaUsdcPrice();
      await this.dexScreenerCache.seed();
      const raydium = await Raydium.load({
        connection: this.config.connection,
      });
      new CallbackQueryListener(
        this.config,
        this.telegramService,
        this.prismaUserRepository,
        this.prismaSubscriptionRepository,
      ).start();
      new StartCommand(
        this.config,
        this.telegramService,
        this.prismaUserRepository,
        this.prismaSubscriptionRepository,
      ).addHandler();
      new CronScheduleService([
        new SubscriptionSchedule(
          this.config,
          this.prismaUserRepository,
          this.prismaSubscriptionRepository,
        ),
        new BoostsSchedule(
          this.config,
          raydium,
          this.dexScreenerCache,
          this.prismaUserRepository,
          this.telegramService,
        ),
        new SolanaPriceSchedule(this.config),
      ]).start();
      await this.telegramService.launch();
    } catch (err) {
      logger.error('unexpected issue');
    }
  }
}

const dexBoosts = new DexBoosts();
dexBoosts
  .start()
  .then(() => logger.info('[Boosts Tracker] Started'))
  .catch(() => logger.error('[Boosts Tracker] Error'));
