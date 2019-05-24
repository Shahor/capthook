const asyncHooks = require("async_hooks")

export type ContextData = Map<string, any>
export type NamespaceContexts = Map<number, ContextData>

export default class Namespace {
	contexts: NamespaceContexts = new Map<number, ContextData>()

	construct() {}

	run(callback: Function) {
		const executionId: number = asyncHooks.executionAsyncId()

		this.contexts.set(executionId, new Map())
		callback()
	}

	set(key: string, value: any) {
		const executionId: number = asyncHooks.executionAsyncId()
		const context = this.contexts.get(executionId) || new Map()

		context.set(key, value)
		this.contexts.set(executionId, context)
	}

	get(key: string) {
		const executionId: number = asyncHooks.executionAsyncId()
		const context = this.contexts.get(executionId) || new Map()

		return context.get(key)
	}
}
