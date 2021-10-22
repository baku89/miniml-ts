import {Env} from '../env'
import {parse} from '../parser'
import {evaluate} from '.'

describe('evaluator', () => {
	run('1', '1')
	run('2', '2')
	run('1 + 2', '3')
	run('1 < 2', 'true')
	run('2 < 1', 'false')
	run('if 1 < 2 then 5 else 6', '5')
	run('let x = 1 in let y = 2 in x + y', '3')

	function run(input: string, expected: string) {
		test(`${input} is evaluated to ${expected}`, () => {
			const exp = parse(input)
			const val = evaluate(exp, new Env())
			expect(val.print()).toBe(expected)
		})
	}
})

describe('error handling', () => {
	run('x', 'Variable not bound: x')
	run('false + 1', 'Both arguments must be int: +')
	run('false < true', 'Both arguments must be int: <')

	function run(input: string, msg: string) {
		test(`${input} must throw an error with message ${msg}`, () => {
			const exp = parse(input)
			expect(() => evaluate(exp, new Env())).toThrowError(msg)
		})
	}
})
