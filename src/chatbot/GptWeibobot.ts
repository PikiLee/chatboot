import { Chat, GptChat } from '../chat'
import { Platform, Weibo } from '../platform'
import { Chatbot } from './Chatbot.js'

export class GptWeiboBot extends Chatbot {
	createChat(): Chat {
		return new GptChat()
	}

	createPlatform(): Platform {
		return new Weibo()
	}
}
