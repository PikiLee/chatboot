import * as dotenv from 'dotenv'
dotenv.config()

import { Chat } from './Chat'
import {
	Configuration,
	OpenAIApi,
	type ChatCompletionRequestMessage,
} from 'openai'
import { v4 as uuid } from 'uuid'

export class GptChat implements Chat {
	protected openai: OpenAIApi
	protected chatHistory: Record<string, string[]> = {}

	constructor() {
		const configuration = new Configuration({
			apiKey: process.env.OPENAI_API_KEY,
		})
		this.openai = new OpenAIApi(configuration)
	}

	protected transformMessages(
		messages: string[]
	): ChatCompletionRequestMessage[] {
		const transformedMessages: ChatCompletionRequestMessage[] = []
		for (let i = 0; i < messages.length; i++) {
			if (i % 2 === 0) {
				transformedMessages.push({
					role: 'assistant',
					content: messages[i],
				})
			} else {
				transformedMessages.push({
					role: 'user',
					content: messages[i],
				})
			}
		}

		return transformedMessages
	}

	public startChat(): string {
		const id = uuid()
		this.chatHistory[id] = []
		return id
	}

	public endChat(chatId: string): void {
		delete this.chatHistory[chatId]
	}

	async ask(chatId: string, message: string): Promise<string> {
		if (!this.chatHistory[chatId]) throw new Error('Chat not found.')
		if (message.length === 0) throw new Error('Message is empty.')

		const newHistory = [...this.chatHistory[chatId], message]
		const response = await this.openai.createChatCompletion({
			model: 'gpt-3.5-turbo-0301',
			messages: this.transformMessages(newHistory),
			temperature: 0,
			max_tokens: 7,
		})

		if (
			response.data.choices.length > 0 &&
			response.data.choices[0].message
		) {
			const newMessage = response.data.choices[0].message.content
			newHistory.push(newMessage)
			this.chatHistory[chatId] = newHistory
			return newMessage
		}

		throw new Error('No response.')
	}
}
