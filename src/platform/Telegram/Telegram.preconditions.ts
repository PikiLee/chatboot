import * as dotenv from 'dotenv'
dotenv.config()

import telegramTestServer from 'telegram-test-api'

const server = new telegramTestServer({
	host: 'localhost',
	port: 9000,
})
server.start()

if (!process.env.TELEGRAM_BOT_TOKEN)
	throw new Error('TELEGRAM_BOT_TOKEN is not set')

const client = server.getClient(process.env.TELEGRAM_BOT_TOKEN)
const message = client.makeMessage('hello')
client.sendMessage(message)
client.getUpdates()
