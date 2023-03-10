import { Observer, Subject } from '../Observer/index.js'

export interface MessageContext {
	message: string | string[]
	sendMessage: (response: string) => void
}

export abstract class Platform implements Subject {
	protected observers: Observer[] = []

	abstract getMessageContexts(): MessageContext[]

	registerObserver(observer: Observer): void {
		this.observers.push(observer)
	}

	removeObserver(observer: Observer): void {
		const index = this.observers.indexOf(observer)
		if (index >= 0) this.observers.splice(index, 1)
	}

	notifyObservers(): void {
		for (const observer of this.observers) {
			observer.update()
		}
	}
}
