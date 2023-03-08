import * as dotenv from 'dotenv'
dotenv.config()

import { Chat } from './Chat.js'
import {
	Configuration,
	OpenAIApi,
	type ChatCompletionRequestMessage,
} from 'openai'

export class GptChat implements Chat {
	protected openai: OpenAIApi

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

	async ask(messages: string[] | string): Promise<string> {
		if (messages.length === 0) throw new Error('Message is empty.')
		if (typeof messages === 'string') {
			messages = [messages]
		}

		const response = await this.openai.createChatCompletion({
			model: 'gpt-3.5-turbo-0301',
			messages: this.transformMessages(messages),
			temperature: 0,
			max_tokens: 7,
		})

		if (
			response.data.choices.length > 0 &&
			response.data.choices[0].message
		) {
			const newMessage = response.data.choices[0].message.content
			return newMessage
		}

		throw new Error('No response.')
	}
}
