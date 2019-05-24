import Namespace, { ContextData } from "./namespace"
import { AsyncHook, createHook } from "async_hooks"

interface NamespaceMapEntry {
	namespace: Namespace
	hook: AsyncHook
}

const namespaceMap = new Map<string, NamespaceMapEntry>()

export function createNamespace(name: string): Namespace {
	const existingNamespace = getNamespace(name)

	if (existingNamespace) {
		throw new Error(`A namespace with the name ${name} already exists.`)
	}

	const namespace = new Namespace()
	const hook = createHook({
		init(asyncId: number, _: any, triggerId: number) {
			if (namespace.contexts.has(triggerId)) {
				namespace.contexts.set(
					asyncId,
					namespace.contexts.get(triggerId) || (new Map() as ContextData)
				)
			}
		},
		destroy(asyncId: number) {
			namespace.contexts.delete(asyncId)
		},
	}).enable()

	namespaceMap.set(name, {
		namespace,
		hook,
	})

	return namespace
}

export function getNamespace(name: string): Namespace | void {
	const namespaceEntry = namespaceMap.get(name)

	if (namespaceEntry) {
		return namespaceEntry.namespace
	}
}

export function destroyNamespace(name: string): boolean {
	const namespaceEntry = namespaceMap.get(name)

	if (namespaceEntry) {
		namespaceEntry.hook.disable()
		namespaceMap.delete(name)
	}

	return true
}
