import peggy from 'peggy'

import * as exp from '../exp'
// import ParserDefinition from './parser.pegjs'

const ParserDefinition = `
Program = Exp

Exp = Int / Bool

Int = str:$([0-9]+)
	{
		const value = parseInt(str)
		return {
			type: 'int',
			value
		}
	}

Bool = str:$("true" / "false")
	{
		const value = str === 'true'
		return {
			tyoe: 'bool',
			value
		}
	}
`

const parser = peggy.generate(ParserDefinition)

export function parse(str: string): exp.Exp {
	return parser.parse(str.trim())
}
