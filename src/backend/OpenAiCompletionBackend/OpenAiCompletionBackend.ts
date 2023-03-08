import { Backend } from '../Backend'
import { Configuration, OpenAIApi } from 'openai'

export class OpenAiCompletionBackend implements Backend {
	protected openai: OpenAIApi

	constructor() {
		const configuration = new Configuration({
			apiKey: process.env.OPENAI_API_KEY,
		})
		this.openai = new OpenAIApi(configuration)
	}

	async ask(messages: string[] | string): Promise<string> {
		if (Array.isArray(messages)) {
			messages = messages.join('')
		}

		const response = await this.openai.createCompletion({
			model: 'gpt-3.5-turbo-0301',
			prompt: messages,
			temperature: 0.6,
		})

		if (response.data.choices.length > 0 && response.data.choices[0].text) {
			const newMessage = response.data.choices[0].text
			return newMessage
		}

		throw new Error('No response.')
	}
}
