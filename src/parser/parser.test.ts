import * as Exp from '../exp'
import {parse} from '.'

describe('literals', () => {
	isExpType('1', 'int')
	isExpType('   1', 'int')
	isExpType('   1   ', 'int')
	isExpType('   1   \t\n', 'int')

	isExpType('true', 'bool')
	isExpType('false', 'bool')

	isExpType('foo', 'var')
	isExpType('__bar', 'var')
	isExpType('__bar0', 'var')
	isExpType('var1', 'var')
	isExpType('if0', 'var')
	isExpType('then_', 'var')
	isExpType('_then', 'var')
	isExpType('(+)', 'var')
	isExpType('(-)', 'var')
	isExpType('(*)', 'var')
	isExpType('(/)', 'var')
	isExpType('(>)', 'var')
	isExpType('(=)', 'var')
	isExpType('(++++)', 'var')
	isExpType('(+/+)', 'var')

	function isExpType(input: string, type: Exp.Type) {
		test(`${input} to be parsed as exp type ${type}`, () => {
			const exp = parse(input)
			expect(exp.type).toBe(type)
		})
	}
})

describe('parsing infix expression', () => {
	testParsing('1 < 2 < 3', '((1 < 2) < 3)')
	testParsing('1 + 2 + 3', '((1 + 2) + 3)')
	testParsing('1 * 2 * 3', '((1 * 2) * 3)')
	testParsing('1 * 2 + 3', '((1 * 2) + 3)')
	testParsing('1 * 2 + 3', '((1 * 2) + 3)')
	testParsing('1 < 3', '(1 < 3)')
	testParsing('1 + 2 < 3', '((1 + 2) < 3)')
	testParsing('(1 + 2) * 3', '((1 + 2) * 3)')
	testParsing('1 + (2 < 3)', '(1 + (2 < 3))')
})

describe('parsing if expression', () => {
	testParsing('if 1 then 2 else 3', '(if 1 then 2 else 3)')
	testParsing('if 1 + 1 then 2 else 3', '(if (1 + 1) then 2 else 3)')
	testParsing(
		'if 1 + 1 then 2 < 3 else 3 < 4',
		'(if (1 + 1) then (2 < 3) else (3 < 4))'
	)
	testParsing(
		'if if a then b else c then d else e',
		'(if (if a then b else c) then d else e)'
	)
	testParsing(
		'if a then if b then c else d else e',
		'(if a then (if b then c else d) else e)'
	)
})

describe('parsing let expression', () => {
	testParsing('let x = 10 in x + 2', '(let x = 10 in (x + 2))')
	testParsing('let x = y + z in x + 2', '(let x = (y + z) in (x + 2))')
	testParsing(
		'let x = 1 in let y = 2 in x + y',
		'(let x = 1 in (let y = 2 in (x + y)))'
	)
	testParsing(
		'let x = 1 and y = 2 in x + y',
		'(let x = 1 and y = 2 in (x + y))'
	)
	testParsing(
		'let twice x = x * 2 in twice',
		'(let twice = (fn x -> (x * 2)) in twice)'
	)
	testParsing(
		'let add x y = x + y in add',
		'(let add = (fn x -> (fn y -> (x + y))) in add)'
	)
})

describe('parsing let rec expression', () => {
	testParsing(
		'let rec f = fn x -> x + 1 in f',
		'(let rec f = (fn x -> (x + 1)) in f)'
	)
	testParsing(
		'let rec f x = x + 1 in f',
		'(let rec f = (fn x -> (x + 1)) in f)'
	)
})

describe('parsing function literal', () => {
	testParsing('fn x -> x + 1', '(fn x -> (x + 1))')
	testParsing('fn x -> fn y -> x + y', '(fn x -> (fn y -> (x + y)))')
})

describe('parsing function application', () => {
	testParsing('neg 10', '(neg 10)')
	testParsing('sin pi * 2', '((sin pi) * 2)')
	testParsing('sin (pi * 2)', '(sin (pi * 2))')
	testParsing('a b c', '((a b) c)')
	testParsing('a b 1 + 2', '(((a b) 1) + 2)')
	testParsing('a b (1 + 2)', '((a b) (1 + 2))')
	testParsing('a (b c)', '(a (b c))')
	testParsing('a + b c', '(a + (b c))')
	testParsing('a + b c + d', '((a + (b c)) + d)')
	testParsing('a < b c + d', '(a < ((b c) + d))')
	testParsing('(a + b) c', '((a + b) c)')
})

describe('parsing complex expressions with proper grouping', () => {
	testParsing('2 < if a then b else c', '(2 < (if a then b else c))')
	testParsing('2 * let x = 1 in x * 2', '(2 * (let x = 1 in (x * 2)))')
})

function testParsing(input: string, expected: string) {
	test(`${input} to be parsed as ${expected}`, () => {
		const exp = parse(input)
		expect(exp.print()).toBe(expected)
	})
}
