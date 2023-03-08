export interface Chat {
	ask(messages: string[] | string): Promise<string>
}
