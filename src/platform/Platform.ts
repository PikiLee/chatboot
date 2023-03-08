export interface Message {
	content: string
	id: string
}

export interface Platform {
	getMessages(): Promise<Message[]>
	sendMessage(id: string, message: string): Promise<void>
}
