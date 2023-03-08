import * as dotenv from 'dotenv'
dotenv.config()

import { Message, Platform } from './Platform'

export class Weibo implements Platform {
	protected messages: Message[] = []
	protected weiboCookie: string
	protected weiboXsrfToken: string
	protected lastPullTime = 0

	constructor() {
		if (!process.env.WEIBO_COOKIE) {
			throw new Error('WEIBO_COOKIE is not set')
		}
		this.weiboCookie = process.env.WEIBO_COOKIE

		if (!process.env.WEIBO_XSRF_TOKEN) {
			throw new Error('WEIBO_XSRF_TOKEN is not set')
		}
		this.weiboXsrfToken = process.env.WEIBO_XSRF_TOKEN
	}

	async getMessages() {
		try {
			const response = await fetch(
				'https://weibo.com/ajax/statuses/mentions',
				{
					headers: {
						cookie: this.weiboCookie,
					},
				}
			)

			const data = await response.json()
			const messages = []
			console.log({ data: data.data.statuses })
			let maxCreatedAt = this.lastPullTime
			for (const status of data.data.statuses.slice(0, 1)) {
				const createdAt = new Date(status.created_at).getTime()
				if (createdAt > this.lastPullTime) {
					messages.push({
						id: status.id,
						content: status.text_raw,
					})

					if (createdAt > maxCreatedAt) {
						maxCreatedAt = status.created_at
					}
				}
			}
			this.lastPullTime = maxCreatedAt
			this.messages = messages
			console.log({ messages })
			return messages
		} catch (e) {
			return []
		}
	}

	async sendMessage(id: string, message: string) {
		this.messages = this.messages.filter((message) => message.id !== id)
		fetch('https://weibo.com/ajax/comments/create', {
			headers: {
				accept: 'application/json, text/plain, */*',
				'content-type': 'application/x-www-form-urlencoded',
				'x-xsrf-token': this.weiboXsrfToken,
				cookie: this.weiboCookie,
			},
			body: `id=${id}&comment=${message}&pic_id=&is_repost=0&comment_ori=0&is_comment=0`,
			method: 'POST',
		})
	}
}
