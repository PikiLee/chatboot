export interface Observer<T> {
	update(state: T): Promise<void>
}
