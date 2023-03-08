import { setupServer } from 'msw/node'
import { rest } from 'msw'

interface BaseMockEndpointOptions {
	path?: string
	status?: number
	body?: string | object
	httpVerb?: 'get' | 'post' | 'put' | 'delete' | 'patch' | 'head' | 'options'
}

const server = setupServer()
server.listen({ onUnhandledRequest: 'error' })

/**
 * Creates a mock endpoint function that can be used in a test.
 * @param baseUrl The base URL of the endpoint. For example, if the endpoint is https://api.github.com/repos/octokit/rest.js, the base URL is https://api.github.com.
 */
export const baseMockEndpoint = (
	baseUrl: string,
	{
		path = '',
		status = 200,
		body = '',
		httpVerb = 'get',
	}: BaseMockEndpointOptions = {}
) => {
	server.use(
		rest[httpVerb](`${baseUrl}${path}`, (req, res, ctx) => {
			return res(ctx.status(status), ctx.json(body))
		})
	)
}
