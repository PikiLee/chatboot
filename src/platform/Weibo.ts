import * as dotenv from 'dotenv'
dotenv.config()

import { Message, Platform } from './Platform.js'
import axios from 'axios'

export class Weibo implements Platform {
	protected messages: Message[] = []
	protected weiboCookie: string
	protected weiboXsrfToken: string
	protected userAgent =
		'Mozilla/5.0 (Windows NT 10.1; WOW64) AppleWebKit/537.3 (KHTML, like Gecko) Chrome/54.0.1108.113 Safari/535'
	protected lastPullTime = new Date().getTime()
	protected username = ''

	constructor() {
		if (!process.env.WEIBO_COOKIE) {
			throw new Error('WEIBO_COOKIE is not set')
		}
		this.weiboCookie = process.env.WEIBO_COOKIE

		this.weiboXsrfToken = this.getXsrfToken(this.weiboCookie)
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

	async getMessages(): Promise<Message[]> {
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
			return messages
		} catch (e) {
			console.log('Error', e)
			return []
		}
	}

	async sendMessage(id: string, message: string) {
		if (message.length > 140) {
			for (let i = 0; i < message.length; i += 140) {
				await this.sendMessage(id, message.slice(i, i + 140))
			}
		} else {
			this.messages = this.messages.filter((message) => message.id !== id)
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
