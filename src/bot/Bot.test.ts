import { describe, it } from 'vitest'
import { askSucceed } from '../backend/OpenAiChatBackend/OpenAiChatBackend.preconditions.js'
import { hasMessages, replySucceed } from '../platform/Weibo.preconditions.js'
import { OpenAiChatWeiboBot } from './OpenAiChatWeiboBot.js'

function sleep(milliseconds: number) {
	return new Promise((resolve) => setTimeout(resolve, milliseconds))
}

describe('Chatbot', () => {
	it(
		'should run',
		async () => {
			hasMessages(2)
			replySucceed()
			askSucceed()

			const bot = new OpenAiChatWeiboBot()
			bot.run()

			await sleep(8000)

			hasMessages(2)

			await sleep(3000)
		},
		{ timeout: 20000 }
	)
})
