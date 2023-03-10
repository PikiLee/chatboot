import { Observer, Subject } from '../Observer/index.js'

export interface Message {
	content: string | string[]
	id: string
}

export abstract class Platform implements Subject {
	protected observers: Observer[] = []

	abstract getMessages(): Message[]
	abstract sendMessage(id: string, message: string): Promise<void>

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
