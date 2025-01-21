import { Context, Middleware, NarrowedContext, Telegraf } from 'telegraf';
import { CallbackQuery, InlineKeyboardMarkup, Message, ParseMode, Update } from 'telegraf/types';
import { PORT, TELEGRAM_TOKEN, TG_WEBHOOK_BASE_URL } from '../../constants';

export class TelegramService {
  private readonly telegraf: Telegraf;

  constructor() {
    this.telegraf = new Telegraf(TELEGRAM_TOKEN);
  }

  public async launch() {
    return this.telegraf.launch({
      webhook: {
        domain: TG_WEBHOOK_BASE_URL,
        port: PORT,
      },
    });
  }

  public async editMessageText(
    channelId: number,
    messageId: number,
    message: string,
    options?: {
      replyMarkup?: InlineKeyboardMarkup;
      mode?: ParseMode;
    },
  ) {
    return this.telegraf.telegram.editMessageText(channelId, messageId, undefined, message, {
      link_preview_options: {
        is_disabled: true,
      },
      reply_markup: options?.replyMarkup,
      parse_mode: options?.mode,
    });
  }

  public async sendMessage(
    channelId: number,
    message: string,
    options?: {
      messageId?: number;
      disableLinkPreview?: boolean;
      replyMarkup?: InlineKeyboardMarkup;
      mode?: ParseMode;
    },
  ) {
    return this.telegraf.telegram.sendMessage(channelId, message, {
      parse_mode: options?.mode,
      reply_markup: options?.replyMarkup,
      reply_parameters: {
        message_id: options?.messageId ?? -1,
        allow_sending_without_reply: true,
      },
      link_preview_options: {
        is_disabled: true,
      },
    });
  }

  public start(fn: Parameters<Telegraf['start']>[0]) {
    return this.telegraf.start(fn);
  }

  public onMessage(
    fn: Middleware<NarrowedContext<Context<Update>, Update.MessageUpdate<Message>>>,
  ) {
    return this.telegraf.on('message', fn);
  }

  public use(fn: Middleware<Context<Update>>) {
    return this.telegraf.use(fn);
  }

  public onCallbackQuery(
    fn: Middleware<NarrowedContext<Context<Update>, Update.CallbackQueryUpdate<CallbackQuery>>>,
  ) {
    return this.telegraf.on('callback_query', fn);
  }

  public command(cmd: Parameters<Telegraf['command']>[0], fn: Parameters<Telegraf['command']>[1]) {
    return this.telegraf.command(cmd, fn);
  }

  public async pinMessage(channelId: number, messageId: number) {
    return this.telegraf.telegram.pinChatMessage(channelId, messageId);
  }
}
