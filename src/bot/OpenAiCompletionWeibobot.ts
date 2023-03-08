import { Backend, OpenAiCompletionBackend } from '../backend/index.js'
import { Platform, Weibo } from '../platform/index.js'
import { Bot } from './Bot.js'

export class OpenAiCompletionWeibobot extends Bot {
	createBackend(): Backend {
		return new OpenAiCompletionBackend()
	}

	createPlatform(): Platform {
		return new Weibo()
	}
}
