import * as dotenv from 'dotenv'
dotenv.config()

import { Backend } from '../backend/index.js'
import { Observer } from '../Observer/index.js'
import { Platform, type MessageContextList } from '../platform/index.js'

export abstract class Bot implements Observer<MessageContextList> {
	platform: Platform
	backend: Backend

	constructor() {
		this.platform = this.createPlatform()
		this.backend = this.createBackend()

		this.platform.registerObserver(this)
	}

	async update(state: MessageContextList) {
		try {
			for (const context of state) {
				const response = await this.backend.ask(context.message)
				console.log('Response:', response)
				context.sendMessage(response)
			}
		} catch (err) {
			console.error(err)
		}
	}

	abstract createBackend(): Backend
	abstract createPlatform(): Platform
}
