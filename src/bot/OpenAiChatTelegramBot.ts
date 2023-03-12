import { Backend, OpenAiChatBackend } from '../backend/index.js'
import { Platform, Telegram } from '../platform/index.js'
import { Bot } from './Bot.js'

export class OpenAiChatTelegramBot extends Bot {
	createBackend(): Backend {
		return new OpenAiChatBackend()
	}

	createPlatform(): Platform {
		return new Telegram()
	}
}
