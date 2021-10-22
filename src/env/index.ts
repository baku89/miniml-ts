import {parse} from '../parser'
import * as value from '../value'

export class Env<T> {
	private constructor(private pairs = new Map<string, T>()) {}

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

	public static createGlobal() {
		const env = new Env<value.Value>()

		env.pairs.set('+', new value.Fn('x', parse('fn y -> x + y'), env))
		env.pairs.set('*', new value.Fn('x', parse('fn y -> x * y'), env))
		env.pairs.set('<', new value.Fn('x', parse('fn y -> x < y'), env))

		return env
	}
}
