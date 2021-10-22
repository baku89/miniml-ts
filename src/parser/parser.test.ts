import {parse} from '.'

describe('parser', () => {
	runTest('1', '1')
	runTest('   1', '1')
	runTest('   1   ', '1')
	runTest('   1   \t\n', '1')
	runTest('true', 'true')
	runTest('false', 'false')
	runTest('1 * 2 + 3', '((1 * 2) + 3)')
	runTest('1 < 3', '(1 < 3)')
	runTest('1 + 2 < 3', '((1 + 2) < 3)')
	runTest('(1 + 2) * 3', '((1 + 2) * 3)')
	runTest('1 + (2 < 3)', '(1 + (2 < 3))')
	runTest('if 1 then 2 else 3', '(if 1 then 2 else 3)')
	runTest('if 1 + 1 then 2 else 3', '(if (1 + 1) then 2 else 3)')
	runTest(
		'if 1 + 1 then 2 < 3 else 3 < 4',
		'(if (1 + 1) then (2 < 3) else (y))'
	)

	function runTest(input: string, expected: string) {
		test(`${input} to be parsed as ${expected}`, () => {
			const exp = parse(input)
			expect(exp.print()).toBe(expected)
		})
	}
})
