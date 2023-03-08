import { OpenAiChatBackend } from './OpenAiChatBackend/OpenAiChatBackend.js'
import { baseMockEndpoint } from '../tests/mockEndpoint.js'
import { Backend } from './Backend.js'

const BASE_URL = 'https://api.openai.com/v1'
const CHAT_PATH = '/chat/completions'
const COMPLETION_PATH = '/completions'

export const askSucceed = (backend: Backend) => {
	let choice
	let path
	if (backend instanceof OpenAiChatBackend) {
		choice = {
			index: 0,
			message: {
				role: 'assistant',
				content: '\n\nHello there, how may I assist you today?',
			},
			finish_reason: 'stop',
		}
		path = CHAT_PATH
	} else {
		choice = {
			index: 0,
			text: '\n\nHello there, how may I assist you today?',
		}
		path = COMPLETION_PATH
	}

	baseMockEndpoint(BASE_URL, {
		path,
		status: 200,
		httpVerb: 'post',
		body: {
			choices: [choice],
		},
	})
}
