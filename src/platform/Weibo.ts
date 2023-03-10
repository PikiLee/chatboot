import * as dotenv from 'dotenv'
dotenv.config()

import { Message, Platform } from './Platform.js'
import axios from 'axios'

interface MessageCache extends Message {
	cachedAt: number
}

export class Weibo extends Platform {
	protected messages: Message[] = []
	// messges that have been sent out through getMessages()
	protected messageCaches: MessageCache[] = []
	protected weiboCookie: string
	protected weiboXsrfToken: string
	protected userAgent =
		'Mozilla/5.0 (Windows NT 10.1; WOW64) AppleWebKit/537.3 (KHTML, like Gecko) Chrome/54.0.1108.113 Safari/535'
	protected lastPullTime = new Date().getTime()
	protected username = ''

	constructor() {
		super()
		if (!process.env.WEIBO_COOKIE) {
			throw new Error('WEIBO_COOKIE is not set')
		}
		this.weiboCookie = process.env.WEIBO_COOKIE

		this.weiboXsrfToken = this.getXsrfToken(this.weiboCookie)

		this.listenForMessages({ immediate: true })
	}

	// listen for new messages for a certain interval
	protected listenForMessages({ immediate }: { immediate?: boolean } = {}) {
		if (immediate) {
			this.retrieveMessages()
			this.listenForMessages()
		} else {
			const interval = 5000 * Math.random() + 7500
			console.log(`Checking for new messages in ${interval}ms`)
			setInterval(async () => {
				this.retrieveMessages()
				this.listenForMessages()
			}, interval)
		}
	}

	/**
	 * Retrieve messages from Weibo, and notify observers if there are new messages
	 */
	protected async retrieveMessages() {
		try {
			const response = await axios.get(
				'https://weibo.com/ajax/statuses/mentions',
				{
					headers: {
						cookie: this.weiboCookie,
						'x-xsrf-token': this.weiboXsrfToken,
						'User-Agent': this.userAgent,
					},
				}
			)

			const data = response.data
			const messages = []
			let maxCreatedAt = this.lastPullTime
			for (const status of data.data.statuses) {
				const createdAt = new Date(status.created_at).getTime()
				if (createdAt > this.lastPullTime) {
					messages.push({
						id: status.id,
						content: await this.removeAt(status.text_raw),
					})

					if (createdAt > maxCreatedAt) {
						maxCreatedAt = createdAt
					}
				}
			}
			this.lastPullTime = maxCreatedAt
			this.messages = messages
			if (messages.length > 0) {
				console.log('Got messages:', messages)
				this.notifyObservers()
			}
		} catch (e) {
			console.log('Error', e)
		}
	}

	protected getXsrfToken(cookie: string) {
		const regex = /XSRF-TOKEN=(.+?);/
		const match = cookie.match(regex)
		if (match) {
			return match[1]
		} else {
			throw new Error('XSRF token not found in cookie')
		}
	}

	protected async removeAt(content: string): Promise<string> {
		try {
			const userName = this.username ?? (await this.getUserName())
			const regex = new RegExp(`@${userName}[^ ]+`, 'g')
			return content.replaceAll(regex, '')
		} catch {
			return content
		}
	}

	protected async getUserName(): Promise<string> {
		const res = await axios.get(
			'https://weibo.com/ajax/setting/getBasicInfo',
			{
				headers: {
					'x-xsrf-token': this.weiboXsrfToken,
					cookie: this.weiboCookie,
					'User-Agent': this.userAgent,
				},
			}
		)

		this.username = res.data.data.screen_name

		return this.username
	}

	getMessages(): Message[] {
		this.messageCaches = this.messageCaches.concat(
			// @ts-expect-error cachedAt is added to the message
			this.messages.map((m) => {
				;(m as MessageCache).cachedAt = new Date().getTime()
				return m
			})
		)
		this.messageCaches = this.messageCaches.filter(
			(message) =>
				new Date().getTime() - message.cachedAt > 1000 * 60 * 10 // 10 minutes
		)
		return this.messages
	}

	async sendMessage(id: string, message: string) {
		if (message.length > 140) {
			for (let i = 0; i < message.length; i += 140) {
				await this.sendMessage(id, message.slice(i, i + 140))
			}
		} else {
			this.messageCaches = this.messageCaches.filter(
				(message) => message.id !== id
			)
			await fetch('https://weibo.com/ajax/comments/create', {
				headers: {
					accept: 'application/json, text/plain, */*',
					'content-type': 'application/x-www-form-urlencoded',
					'x-xsrf-token': this.weiboXsrfToken,
					cookie: this.weiboCookie,
					'User-Agent': this.userAgent,
				},
				method: 'POST',
				body: `id=${id}&comment=${message}&pic_id=&is_repost=0&comment_ori=0&is_comment=0`,
			})
		}
	}
}
