import { OpenAiCompletionBackend } from './OpenAiCompletionBackend/OpenAiCompletionBackend'
import { askSucceed } from './Backend.preconditions.js'
import { describe, it, expect } from 'vitest'
import { OpenAiChatBackend } from './OpenAiChatBackend/OpenAiChatBackend.js'

describe('Backend', () => {
	it.each([[OpenAiChatBackend], [OpenAiCompletionBackend]])(
		'should return a response',
		async (Backend) => {
			const backend = new Backend()
			askSucceed(backend)

			const response = await backend.ask(['Hello'])
			expect(typeof response).toBe('string')
		}
	)
})
