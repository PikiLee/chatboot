import { Chat } from '../chat'
import { Platform } from '../platform'

const BASE_TIME_TO_WAIT = 10000 // 10 seconds
const MAX_TIME_TO_WAIT = 600000 // 10 minutes

export abstract class Chatbot {
	protected platform: Platform
	protected chat: Chat
	protected timeToWait = BASE_TIME_TO_WAIT

	constructor() {
		this.platform = this.createPlatform()
		this.chat = this.createChat()
	}

	async run() {
		while (true) {
			const messages = await this.platform.getMessages()
			if (messages.length === 0)
				this.timeToWait = Math.min(
					this.timeToWait * 2,
					MAX_TIME_TO_WAIT
				)
			else {
				this.timeToWait = BASE_TIME_TO_WAIT
				for (const message of messages) {
					const response = await this.chat.ask(message.content)
					this.platform.sendMessage(message.id, response)
				}
			}
			await new Promise((resolve) => setTimeout(resolve, this.timeToWait))
		}
	}

	abstract createChat(): Chat
	abstract createPlatform(): Platform
}
