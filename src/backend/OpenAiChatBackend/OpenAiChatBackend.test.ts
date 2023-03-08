import { askSucceed } from './OpenAiChatBackend.preconditions.js'
import { describe, it, expect } from 'vitest'
import { OpenAiChatBackend } from './OpenAiChatBackend.js'

describe('GptChat', () => {
	it('should return a response', async () => {
		askSucceed()

		const chat = new OpenAiChatBackend()
		const response = await chat.ask(['Hello'])
		expect(typeof response).toBe('string')
	})
})
