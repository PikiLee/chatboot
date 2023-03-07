import { describe, it, expect } from 'vitest'
import { GptChat } from './GptChat'

describe('GptChat', () => {
	it('should return a response', async () => {
		const chat = new GptChat()
		const response = await chat.ask(['Hello'])
		expect(typeof response).toBe('string')
	})
})
