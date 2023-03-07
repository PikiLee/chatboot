import { Observer } from './Observer'

export interface Subject {
	registerObserver(observer: Observer): void
	removeObserver(observer: Observer): void
	notifyObservers(): void
}
