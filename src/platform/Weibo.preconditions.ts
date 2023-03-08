import { curriedMockEndpoint } from '../tests/mockEndpoint'

const newMessages = [
	{
		id: '0',
		text_raw: 'Hei?',
		created_at: '2030-02-13T12:30:00.000Z',
	},
	{
		id: '1',
		text_raw: 'How are you?',
		created_at: '2028-02-13T12:30:00.000Z',
	},
	{
		id: '2',
		text_raw: 'What is your name?',
		created_at: '2029-03-01T09:45:00.000Z',
	},
]

const oldMessages = [
	{
		id: '3',
		text_raw: 'Can you help me?',
		created_at: '2021-04-20T15:10:00.000Z',
	},
	{
		id: '4',
		text_raw: 'Thank you!',
		created_at: '2021-05-05T18:20:00.000Z',
	},
	{
		id: '5',
		text_raw: 'Goodbye!',
		created_at: '2021-06-10T21:15:00.000Z',
	},
	{
		id: '6',
		text_raw: 'What is the weather like today?',
		created_at: '2021-07-15T08:00:00.000Z',
	},
	{
		id: '7',
		text_raw: 'How do I reset my password?',
		created_at: '2021-08-02T16:30:00.000Z',
	},
	{
		id: '8',
		text_raw: 'Can you recommend a good restaurant?',
		created_at: '2021-09-09T19:45:00.000Z',
	},
	{
		id: '9',
		text_raw: 'What is the meaning of life?',
		created_at: '2021-10-11T10:00:00.000Z',
	},
	{
		id: '10',
		text_raw: 'Do you have any hobbies?',
		created_at: '2021-11-25T14:20:00.000Z',
	},
	{
		id: '11',
		text_raw: 'What is your favorite color?',
		created_at: '2022-01-03T11:15:00.000Z',
	},
	{
		id: '12',
		text_raw: 'How can I improve my productivity?',
		created_at: '2022-02-14T09:30:00.000Z',
	},
	{
		id: '13',
		text_raw: 'What is the best way to learn a new language?',
		created_at: '2022-03-05T16:45:00.000Z',
	},
	{
		id: '14',
		text_raw: 'Can you help me find a job?',
		created_at: '2022-04-18T12:10:00.000Z',
	},
	{
		id: '15',
		text_raw: 'How do I create a website?',
		created_at: '2022-05-30T08:50:00.000Z',
	},
]

const mockGet = curriedMockEndpoint(
	'https://weibo.com',
	'/ajax/statuses/mentions'
)
const mockCreate = curriedMockEndpoint(
	'https://weibo.com',
	'/ajax/comments/create'
)

export function hasMessages(count: number) {
	const statuses = [...newMessages.slice(0, count), ...oldMessages]
	return mockGet(200, {
		data: {
			statuses,
		},
	})
}

export function hasMessagesFail() {
	return mockGet(400, 'error')
}

export function replySucceed() {
	return mockCreate(200, 'ok')
}
