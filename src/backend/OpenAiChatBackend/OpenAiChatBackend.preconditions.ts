import { baseMockEndpoint } from '../../tests/mockEndpoint.js'

const BASE_URL = 'https://api.openai.com/v1'
const CHAT_PATH = '/chat/completions'

export const askSucceed = () => {
	baseMockEndpoint(BASE_URL, {
		path: CHAT_PATH,
		status: 200,
		httpVerb: 'post',
		body: {
			choices: [
				{
					index: 0,
					message: {
						role: 'assistant',
						content: '\n\nHello there, how may I assist you today?',
					},
					finish_reason: 'stop',
				},
			],
		},
	})
}
