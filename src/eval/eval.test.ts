import {Env} from '../env'
import {parse} from '../parser'
import {evaluate} from '.'

describe('evaluator', () => {
	testEvaluate('1', '1')
	testEvaluate('2', '2')
	testEvaluate('1 + 2', '3')
	testEvaluate('1 < 2', 'true')
	testEvaluate('2 < 1', 'false')
	testEvaluate('if 1 < 2 then 5 else 6', '5')
	testEvaluate('let x = 1 in let y = 2 in x + y', '3')
	testEvaluate('let x = 1 in let x = 2 and y = x in x + y', '3')
	testEvaluate('fn x -> x', '(fn x -> x)')
	testEvaluate('fn x -> x + 1', '(fn x -> (x + 1))')
})

describe('function application', () => {
	testEvaluate('(fn x -> x * 2) 3', '6')
	testEvaluate('(fn x -> fn y -> x + y) 10 5', '15')
	testEvaluate(
		`let f = let x = 2 in let addx = fn y -> x + y in addx in f 4`,
		'6'
	)
	testEvaluate(
		'let applyTwice = fn f -> fn x -> f (f x) and inc = fn x -> x + 1 in applyTwice inc 4',
		'6'
	)
	testEvaluate('(+) 2 3', '5')
	testEvaluate('(*) 2 3', '6')
	testEvaluate('(<) 2 3', 'true')
	testEvaluate('(<) 2 3', 'true')
	testEvaluate(
		'let apply3 = fn f -> fn x -> f (f x x) (f x x) in apply3 (+) 5',
		'20'
	)
	testEvaluate('let apply3 f x = f (f x x) (f x x) in apply3 (+) 5', '20')
})

describe('recursive function', () => {
	testEvaluate('let rec f x = if 9 < x then 10 else x + f (x + 1) in f 3', '52')
})

describe('error handling', () => {
	run('x', 'Variable not bound: x')
	run('false + 1', 'Both arguments must be int: +')
	run('false < true', 'Both arguments must be int: <')
	run(
		'if 10 then 20 else 30',
		'Test expression must be boolean value, but got: 10'
	)

	function run(input: string, msg: string) {
		test(`${input} must throw an error with message ${msg}`, () => {
			const exp = parse(input)
			expect(() => evaluate(exp, Env.createGlobal())).toThrowError(msg)
		})
	}
})

function testEvaluate(input: string, expected: string) {
	test(`${input} is evaluated to ${expected}`, () => {
		const exp = parse(input)
		const val = evaluate(exp, Env.createGlobal())
		expect(val.print()).toBe(expected)
	})
}
