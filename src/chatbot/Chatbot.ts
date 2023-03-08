import * as dotenv from 'dotenv'
dotenv.config()

import { Chat } from '../chat/index.js'
import { Platform } from '../platform/index.js'

export abstract class Chatbot {
	protected BASE_TIME_TO_WAIT: number
	protected MAX_TIME_TO_WAIT: number
	protected platform: Platform
	protected chat: Chat
	protected timeToWait: number

	constructor() {
		if (process.env.BASE_TIME_TO_WAIT === undefined)
			throw new Error('BASE_TIME_TO_WAIT is not defined.')
		this.BASE_TIME_TO_WAIT = parseInt(process.env.BASE_TIME_TO_WAIT)
		this.timeToWait = this.BASE_TIME_TO_WAIT

		if (process.env.MAX_TIME_TO_WAIT === undefined)
			throw new Error('MAX_TIME_TO_WAIT is not defined.')
		this.MAX_TIME_TO_WAIT = parseInt(process.env.MAX_TIME_TO_WAIT)

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
					Math.max(Math.random(), 0.75) *
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
