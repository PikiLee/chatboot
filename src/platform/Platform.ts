import { Observer, Subject } from '../Observer/index.js'

export interface MessageContext {
	message: string | string[]
	sendMessage: (response: string) => void
}

export type MessageContextList = MessageContext[]

export abstract class Platform implements Subject<MessageContextList> {
	protected observers: Observer<MessageContextList>[] = []

	registerObserver(observer: Observer<MessageContextList>): void {
		this.observers.push(observer)
	}

	removeObserver(observer: Observer<MessageContextList>): void {
		const index = this.observers.indexOf(observer)
		if (index >= 0) this.observers.splice(index, 1)
	}

	notifyObservers(state: MessageContextList): void {
		for (const observer of this.observers) {
			observer.update(state)
		}
	}
}
