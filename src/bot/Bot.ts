import * as dotenv from 'dotenv'
dotenv.config()

import { Backend } from '../backend/index.js'
import { Observer } from '../Observer/index.js'
import { Platform } from '../platform/index.js'

export abstract class Bot implements Observer {
	platform: Platform
	backend: Backend

	constructor() {
		this.platform = this.createPlatform()
		this.backend = this.createBackend()

		this.platform.registerObserver(this)
	}

	async update() {
		try {
			const messages = await this.platform.getMessages()
			for (const message of messages) {
				const response = await this.backend.ask(message.content)
				console.log('Response:', response)
				this.platform.sendMessage(message.id, response)
			}
		} catch (err) {
			console.error(err)
		}
	}

	abstract createBackend(): Backend
	abstract createPlatform(): Platform
}
