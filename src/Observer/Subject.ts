import { Observer } from './Observer.js'

export interface Subject {
	registerObserver(observer: Observer): void
	removeObserver(observer: Observer): void
	notifyObservers(): void
}
