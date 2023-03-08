import { describe, it, expect } from 'vitest'
import { Weibo } from './Weibo'

describe('Weibo', () => {
	it('should return messages', async () => {
		const platform = new Weibo()
		const messages = await platform.getMessages()
		expect(messages.length).toBeGreaterThan(0)

		// platform.sendMessage(messages[0].id, 'good work')
	})
})
