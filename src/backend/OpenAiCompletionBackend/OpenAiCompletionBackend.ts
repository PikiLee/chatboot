import * as dotenv from 'dotenv'
dotenv.config()

import { Backend } from '../Backend'
import { Configuration, OpenAIApi } from 'openai'

export class OpenAiCompletionBackend implements Backend {
	protected openai: OpenAIApi

	constructor() {
		if (!process.env.OPENAI_API_KEY) throw new Error('No API key provided.')
		const configuration = new Configuration({
			apiKey: process.env.OPENAI_API_KEY,
		})
		this.openai = new OpenAIApi(configuration)
	}

	async ask(messages: string[] | string): Promise<string> {
		const response = await this.openai.createCompletion({
			model: 'text-davinci-003',
			prompt: messages,
			temperature: 0.6,
			max_tokens: 2000,
		})

		if (response.data.choices.length > 0 && response.data.choices[0].text) {
			const newMessage = response.data.choices[0].text
			return newMessage
		}

		throw new Error('No response.')
	}
}
