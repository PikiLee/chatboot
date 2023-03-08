import * as dotenv from 'dotenv'
dotenv.config()

import { Backend } from '../backend/index.js'
import { Platform } from '../platform/index.js'

export abstract class Bot {
	protected BASE_TIME_TO_WAIT: number
	protected MAX_TIME_TO_WAIT: number
	platform: Platform
	backend: Backend
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
		this.backend = this.createBackend()
	}

	async run() {
		while (true) {
			const messages = await this.platform.getMessages()
			if (messages.length === 0) {
				await new Promise((resolve) =>
					setTimeout(resolve, this.timeToWait)
				)
				// Wait longer if no messages
				this.timeToWait = Math.min(
					Math.max(Math.random(), 0.75) *
						(this.timeToWait + this.BASE_TIME_TO_WAIT),
					this.MAX_TIME_TO_WAIT
				)
				console.log('No messages, waiting for', this.timeToWait, 'ms')
			} else {
				this.timeToWait = this.BASE_TIME_TO_WAIT
				console.log('Got messages: ', messages)
				for (const message of messages) {
					try {
						const response = await this.backend.ask(message.content)
						console.log('Response:', response)
						this.platform.sendMessage(message.id, response)
					} catch (err) {
						console.error(err)
					}
				}
			}
		}
	}

	abstract createBackend(): Backend
	abstract createPlatform(): Platform
}
