export interface Chat {
	startChat(): string
	ask(chatId: string, message: string): Promise<string>
	endChat(chatId: string): void
}
