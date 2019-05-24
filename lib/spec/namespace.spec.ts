import { getNamespace, createNamespace, destroyNamespace } from "../index"
import Namespace from "../namespace"

const NAMESPACE_NAME = "foobar"

let namespace: Namespace
describe("CaptHook", function() {
	describe("Namespace", function() {
		beforeEach(function() {
			namespace = createNamespace(NAMESPACE_NAME)
		})

		afterEach(function() {
			destroyNamespace(NAMESPACE_NAME)
		})

		it("should create a namespace", function() {
			expect(namespace).toBeInstanceOf(Namespace)
		})

		it("should set data in namespace", function() {
			namespace.set("foo", "bar")

			expect(namespace.get("foo")).toEqual("bar")
		})

		it("should retrieve data through async calls", function(done) {
			const key = "foo"
			const value = "bar"

			namespace.set(key, value)

			setTimeout(function() {
				process.nextTick(function() {
					const sameNamespace = getNamespace(NAMESPACE_NAME)

					if (sameNamespace) {
						expect(sameNamespace.get(key)).toEqual(value)
						return done()
					}

					done(new Error("retrieved namespace isn't of type Namespace"))
				})
			}, 1)
		})
	})
})
