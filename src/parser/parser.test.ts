import * as exp from '../exp'
import {parse} from '.'

describe('literals', () => {
	runTest('1', 'int')
	runTest('   1', 'int')
	runTest('   1   ', 'int')
	runTest('   1   \t\n', 'int')

	runTest('true', 'bool')
	runTest('false', 'bool')

	runTest('foo', 'var')
	runTest('__bar', 'var')
	runTest('__bar0', 'var')
	runTest('var1', 'var')
	runTest('if0', 'var')
	runTest('then_', 'var')
	runTest('_then', 'var')

	function runTest(input: string, type: exp.Type) {
		test(`${input} to be parsed as exp type ${type}`, () => {
			const exp = parse(input)
			expect(exp.type).toBe(type)
		})
	}
})

describe('parsing grouped expression', () => {
	runTest('1 * 2 + 3', '((1 * 2) + 3)')
	runTest('1 < 3', '(1 < 3)')
	runTest('1 + 2 < 3', '((1 + 2) < 3)')
	runTest('(1 + 2) * 3', '((1 + 2) * 3)')
	runTest('1 + (2 < 3)', '(1 + (2 < 3))')
	runTest('if 1 then 2 else 3', '(if 1 then 2 else 3)')
	runTest('if 1 + 1 then 2 else 3', '(if (1 + 1) then 2 else 3)')
	runTest(
		'if 1 + 1 then 2 < 3 else 3 < 4',
		'(if (1 + 1) then (2 < 3) else (3 < 4))'
	)
	runTest('let x = 10 in x + 2', '(let x = 10 in (x + 2))')
	runTest('let x = y + z in x + 2', '(let x = (y + z) in (x + 2))')
	runTest(
		'let x = 1 in let y = 2 in x + y',
		'(let x = 1 in (let y = 2 in (x + y)))'
	)

	function runTest(input: string, expected: string) {
		test(`${input} to be parsed as ${expected}`, () => {
			const exp = parse(input)
			expect(exp.print()).toBe(expected)
		})
	}
})
