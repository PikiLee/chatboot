import { OpenAiCompletionWeibobot } from './OpenAiCompletionWeibobot'
import { describe, it } from 'vitest'
import { askSucceed } from '../backend/index.js'
import { hasMessages, replySucceed } from '../platform/index.js'
import { OpenAiChatWeiboBot } from './OpenAiChatWeiboBot.js'

function sleep(milliseconds: number) {
	return new Promise((resolve) => setTimeout(resolve, milliseconds))
}

describe('Chatbot', () => {
	it.each([OpenAiChatWeiboBot, OpenAiCompletionWeibobot])(
		'should run',
		async (Bot) => {
			hasMessages(2)
			replySucceed()

			const bot = new Bot()
			askSucceed(bot.backend)

			await sleep(8000)

			hasMessages(2)

			await sleep(3000)
		},
		{ timeout: 20000 }
	)
})
