export interface Backend {
	ask(messages: string[] | string): Promise<string>
}
