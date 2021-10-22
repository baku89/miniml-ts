import * as exp from '../exp'
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

	function isExpType(input: string, type: exp.Type) {
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
})

describe('parsing let expression', () => {
	testParsing('let x = 10 in x + 2', '(let x = 10 in (x + 2))')
	testParsing('let x = y + z in x + 2', '(let x = (y + z) in (x + 2))')
	testParsing(
		'let x = 1 in let y = 2 in x + y',
		'(let x = 1 in (let y = 2 in (x + y)))'
	)
})

describe('parsing function literal', () => {
	testParsing('fn x -> x + 1', '(fn x -> (x + 1))')
})

describe('parsing function application', () => {
	testParsing('neg 10', '(neg 10)')
	testParsing('sin pi * 2', '(sin (pi * 2))')
	testParsing('a b c', '((a b) c)')
	testParsing('a b 1 + 2', '((a b) (1 + 2))')
	testParsing('a (b c)', '(a (b c))')
	testParsing('a + b c', '(a + (b c))')
	testParsing('a + b c + d', '((a + (b c)) + d)')
	testParsing('a + b c * d', '(a + ((b c) * d))')
	testParsing('(a + b) c', '((a + b) c)')
})

function testParsing(input: string, expected: string) {
	test(`${input} to be parsed as ${expected}`, () => {
		const exp = parse(input)
		expect(exp.print()).toBe(expected)
	})
}
