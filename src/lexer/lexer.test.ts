import {Lexer, Token} from '.'

test('lexer', () => {
	const input = '1 + 2 * 3 < false true'

	const expected: Token[] = [
		{type: 'int', value: '1'},
		{type: '+', value: '+'},
		{type: 'int', value: '2'},
		{type: '*', value: '*'},
		{type: 'int', value: '3'},
		{type: '<', value: '<'},
		{type: 'bool', value: 'false'},
		{type: 'bool', value: 'true'},
		{type: 'eof', value: ''},
	]

	const lexer = new Lexer(input)

	for (const e of expected) {
		const t = lexer.nextToken()
		expect(t.type).toBe(e.type)
		expect(t.value).toBe(e.value)
	}
})
