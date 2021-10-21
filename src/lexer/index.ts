import moo from 'moo'

export type TokenType = 'int' | 'bool' | '+' | '*' | '<' | 'eof'

export interface Token {
	type: TokenType
	value: string
}

const rules: moo.Rules = {
	whitespace: {match: /[\s]+/, lineBreaks: true},
	int: /0|[1-9][0-9]*/,
	bool: ['true', 'false'],
	'+': '+',
	'*': '*',
	'<': '<',
}

export class Lexer {
	private lexer: moo.Lexer

	public constructor(public input: string) {
		this.lexer = moo.compile(rules)
		this.lexer.reset(input)
	}

	public nextToken(): Token {
		let token: moo.Token | undefined

		// Skip whitespaces
		while ((token = this.lexer.next())) {
			if (token.type !== 'whitespace') break
		}

		if (!token) {
			return {type: 'eof', value: ''}
		}

		return token as Token
	}
}
