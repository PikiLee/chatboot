import { Chat } from '../chat/index.js'
import { Platform } from '../platform/index.js'

export abstract class Chatbot {
	protected BASE_TIME_TO_WAIT = 1000 // 10 seconds
	protected MAX_TIME_TO_WAIT = 600000 // 10 minutes
	protected platform: Platform
	protected chat: Chat
	protected timeToWait = this.BASE_TIME_TO_WAIT

	constructor() {
		this.platform = this.createPlatform()
		this.chat = this.createChat()
	}

	async run() {
		while (true) {
			const messages = await this.platform.getMessages()
			if (messages.length > 0) console.log('Got messages: ', messages)
			if (messages.length === 0) {
				// Wait longer if no messages
				this.timeToWait = Math.min(
					Math.max(Math.random(), 0.5) *
						(this.timeToWait + this.BASE_TIME_TO_WAIT),
					this.MAX_TIME_TO_WAIT
				)
				console.log('No messages, waiting for', this.timeToWait, 'ms')
			} else {
				this.timeToWait = this.BASE_TIME_TO_WAIT
				for (const message of messages) {
					try {
						const response = await this.chat.ask(message.content)
						console.log('Response:', response)
						this.platform.sendMessage(message.id, response)
					} catch (err) {
						console.error(err)
					}
				}
			}
			await new Promise((resolve) => setTimeout(resolve, this.timeToWait))
		}
	}

	abstract createChat(): Chat
	abstract createPlatform(): Platform
}
