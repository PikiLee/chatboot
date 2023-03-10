import * as dotenv from 'dotenv'
dotenv.config()

import { Platform } from '../Platform.js'
import axios from 'axios'

export class Weibo extends Platform {
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
			setTimeout(() => {
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
			const messageContexts = []
			let maxCreatedAt = this.lastPullTime
			for (const status of data.data.statuses) {
				const createdAt = new Date(status.created_at).getTime()
				if (createdAt > this.lastPullTime) {
					messageContexts.push({
						message: await this.removeAt(status.text_raw),
						sendMessage: ((response: string) =>
							this.sendMessage(status.id, response)).bind(this),
					})

					if (createdAt > maxCreatedAt) {
						maxCreatedAt = createdAt
					}
				}
			}
			this.lastPullTime = maxCreatedAt
			if (messageContexts.length > 0) {
				console.log('Got messages:', messageContexts)
				this.notifyObservers(messageContexts)
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

	protected async sendMessage(id: string, message: string) {
		if (message.length > 140) {
			for (let i = 0; i < message.length; i += 140) {
				await this.sendMessage(id, message.slice(i, i + 140))
			}
		} else {
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
