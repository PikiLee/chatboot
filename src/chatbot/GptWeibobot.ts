import { Chat, GptChat } from '../chat/index.js'
import { Platform, Weibo } from '../platform/index.js'
import { Chatbot } from './Chatbot.js'

export class GptWeiboBot extends Chatbot {
	createChat(): Chat {
		return new GptChat()
	}

	createPlatform(): Platform {
		return new Weibo()
	}
}
