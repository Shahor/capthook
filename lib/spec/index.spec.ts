import asyncHooks from "async_hooks"
import Namespace from "../namespace"
import { getNamespace, createNamespace, destroyNamespace } from "../index"

const NAMESPACE_NAME = "foobar"

let namespace: Namespace
describe("CaptHook", function() {
	beforeEach(function() {
		namespace = createNamespace(NAMESPACE_NAME)
	})

	afterEach(function() {
		destroyNamespace(NAMESPACE_NAME)
	})

	it("should create a namespace", function() {
		expect(namespace).toBeInstanceOf(Namespace)
	})

	it("should throw if a namespace with conflicting name is created", function() {
		expect(createNamespace.bind(null, NAMESPACE_NAME)).toThrow()
	})

	it("should get a namespace", function() {
		const namespace = getNamespace(NAMESPACE_NAME)

		expect(namespace).toBeInstanceOf(Namespace)
	})

	it("should destroy a namespace", function() {
		const result = destroyNamespace(NAMESPACE_NAME)

		const namespace = getNamespace(NAMESPACE_NAME)

		expect(result).toBe(true)
		expect(namespace).not.toBeDefined()
	})
})
