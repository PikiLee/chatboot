import * as dotenv from 'dotenv'
dotenv.config()

import { Platform } from '../Platform'
import { Telegraf } from 'telegraf'
import { message } from 'telegraf/filters'

export class Telegram extends Platform {
	protected messageHistory: string[] = []
	protected MAX_MESSAGE_HISTORY = 12

	constructor() {
		super()

		if (!process.env.TELEGRAM_BOT_TOKEN)
			throw new Error('TELEGRAM_BOT_TOKEN is not set')

		const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN, {
			telegram: {
				apiRoot: 'http://localhost:9000',
			},
		})
		bot.start((ctx) => ctx.reply('Welcome'))
		bot.help((ctx) => ctx.reply('Send me a message'))
		bot.on(message('text'), (ctx) => {
			console.log('Received message from Telegram: ' + ctx.message.text)
			this.messageHistory.push(ctx.message.text)
			if (this.messageHistory.length > this.MAX_MESSAGE_HISTORY)
				this.messageHistory = this.messageHistory.slice(
					-1 * this.MAX_MESSAGE_HISTORY
				)

			const messageContexts = [
				{
					message: this.messageHistory,
					sendMessage: (response: string) => ctx.reply(response),
				},
			]

			this.notifyObservers(messageContexts)
		})
		bot.launch()

		// Enable graceful stop
		process.once('SIGINT', () => bot.stop('SIGINT'))
		process.once('SIGTERM', () => bot.stop('SIGTERM'))
	}
}
