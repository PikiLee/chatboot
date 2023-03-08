import { describe, it, expect } from 'vitest'
import { Weibo } from './Weibo.js'
import {
	replySucceed,
	hasMessages,
	hasMessagesFail,
	getUserNameSucceed,
	getUserNameFail,
} from './Weibo.preconditions'

describe('Weibo', () => {
	it('should return messages', async () => {
		hasMessages(2)
		replySucceed()
		getUserNameSucceed()

		const platform = new Weibo()
		const messages = await platform.getMessages()
		expect(messages.length).toBe(2)

		platform.sendMessage(messages[0].id, 'good work')
	})

	it('should return empty array if fail', async () => {
		hasMessagesFail()
		replySucceed()
		getUserNameSucceed()

		const platform = new Weibo()
		const messages = await platform.getMessages()
		expect(messages.length).toBe(0)
	})

	it('should not fail if get username fail', async () => {
		hasMessages(2)
		replySucceed()
		getUserNameFail()

		const platform = new Weibo()
		const messages = await platform.getMessages()
		expect(messages.length).toBe(2)
	})
})
