import * as dotenv from 'dotenv'
dotenv.config()

import process from 'node:process'
import {
	OpenAiChatWeiboBot,
	OpenAiCompletionWeibobot,
	OpenAiChatTelegramBot,
} from './bot/index.js'

const bots = [
	OpenAiChatWeiboBot,
	OpenAiCompletionWeibobot,
	OpenAiChatTelegramBot,
]
const bot = process.env.BOT_TYPE
	? bots[parseInt(process.env.BOT_TYPE)]
	: OpenAiChatWeiboBot

new bot()

process.stdin.resume() // keep the process running
