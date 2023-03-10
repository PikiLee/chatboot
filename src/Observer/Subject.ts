import { Observer } from './Observer.js'

export interface Subject<T> {
	registerObserver(observer: Observer<T>): void
	removeObserver(observer: Observer<T>): void
	notifyObservers(state: T): void
}
