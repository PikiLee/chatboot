import { curry } from 'lodash-es'
import { setupServer } from 'msw/node'
import { rest } from 'msw'

const server = setupServer()
server.listen()

/**
 * Creates a mock endpoint function that can be used in a test.
 * @param baseUrl The base URL of the endpoint. For example, if the endpoint is https://api.github.com/repos/octokit/rest.js, the base URL is https://api.github.com.
 */
export const baseMockEndpoint = (
	baseUrl: string,
	path: string,
	status: number,
	body: string | object
) => {
	server.use(
		rest.get(`${baseUrl}${path}`, (req, res, ctx) => {
			return res(ctx.status(status), ctx.json(body))
		})
	)
}

export const curriedMockEndpoint = curry(baseMockEndpoint)
