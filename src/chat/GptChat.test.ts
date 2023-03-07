import { describe, it, expect } from 'vitest'
import { GptChat } from './GptChat'

describe('GptChat', () => {
	it('should return a response', async () => {
		const chat = new GptChat()
		const chatId = chat.startChat()
		const response = await chat.ask(chatId, 'Hello')
		chat.endChat(chatId)
		expect(typeof response).toBe('string')
	})
})
