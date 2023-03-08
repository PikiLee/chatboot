import { describe, it } from 'vitest'
import { askSucceed } from '../chat/Gpt.preconditions.js'
import { hasMessages, replySucceed } from '../platform/Weibo.preconditions.js'
import { GptWeiboBot } from './GptWeibobot.js'

function sleep(milliseconds: number) {
	return new Promise((resolve) => setTimeout(resolve, milliseconds))
}

describe('Chatbot', () => {
	it(
		'should create a chatbot',
		async () => {
			hasMessages(2)
			replySucceed()
			askSucceed()

			const chatbot = new GptWeiboBot()
			chatbot.run()

			await sleep(8000)

			hasMessages(2)

			await sleep(3000)
		},
		{ timeout: 20000 }
	)
})
