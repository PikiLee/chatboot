import { Backend, OpenAiChatBackend } from '../backend/index.js'
import { Platform, Weibo } from '../platform/index.js'
import { Bot } from './Bot.js'

export class OpenAiChatWeiboBot extends Bot {
	createBackend(): Backend {
		return new OpenAiChatBackend()
	}

	createPlatform(): Platform {
		return new Weibo()
	}
}
