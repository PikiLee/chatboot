export interface Chat {
	ask(messages: string[]): Promise<string>
}
