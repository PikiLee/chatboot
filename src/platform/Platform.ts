import { Observer, Subject } from '../observer'

interface Message {
	content: string
	id: string
}

export interface MessageSource {
	getMessages(): Promise<Message[]>
	sendMessage(id: string, message: string): Promise<void>
}

export abstract class Platform implements Subject, MessageSource {
	protected observers: Observer[] = []

	registerObserver(observer: Observer): void {
		this.observers.push(observer)
	}

	removeObserver(observer: Observer): void {
		const index = this.observers.indexOf(observer)
		if (index > -1) {
			this.observers.splice(index, 1)
		}
	}

	notifyObservers(): void {
		for (const observer of this.observers) {
			observer.update()
		}
	}

	abstract getMessages(): Promise<Message[]>
	abstract sendMessage(id: string, message: string): Promise<void>
}
