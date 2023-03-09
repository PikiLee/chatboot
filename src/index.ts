import * as dotenv from 'dotenv'
dotenv.config()

import { OpenAiChatWeiboBot, OpenAiCompletionWeibobot } from './bot/index.js'

const bots = [OpenAiChatWeiboBot, OpenAiCompletionWeibobot]
const bot = process.env.BOT_TYPE
	? bots[parseInt(process.env.BOT_TYPE)]
	: OpenAiChatWeiboBot

const chatbot = new bot()
chatbot.run()
