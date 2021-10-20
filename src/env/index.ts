export class Env<T> {
	private pairs = new Map<string, T>()

	public extend(name: string, value: T): Env<T> {
		const newEnv = new Env<T>()

		this.pairs.forEach((v, n) => newEnv.pairs.set(n, v))
		newEnv.pairs.set(name, value)

		return newEnv
	}

	public lookup(name: string): T | null {
		return this.pairs.get(name) ?? null
	}

	public map(f: (value: T) => T): Env<T> {
		const newEnv = new Env<T>()

		this.pairs.forEach((v, n) => newEnv.pairs.set(n, f(v)))

		return newEnv
	}

	public foldr<U>(f: (value: T, previousValue: U) => U, initialValue: U): U {
		const values = [...this.pairs.values()]
		return values.reduceRight((p, c) => f(c, p), initialValue)
	}
}
