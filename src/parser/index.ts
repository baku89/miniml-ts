import peggy from 'peggy'

import * as exp from '../exp'
// import ParserDefinition from './parser.pegjs'

const ParserDefinition = `
Program = Exp

Exp = BinOp / Int / Bool

Int = str:$([0-9]+)
	{
		const val = parseInt(str)
		return new exp.Int(val)
	}

Bool = str:$("true" / "false")
	{
		const val = str === 'true'
		return new exp.Bool(val)
	}

Op = "+" / "*" / "<"

BinOp = left:(Int / Bool) op:Op right:(Int / Bool)
	{
		return new exp.BinOp(left, op, right)
	}
`

const parserSource = peggy.generate(ParserDefinition, {
	exportVar: {exp},
	output: 'source',
})

const parser = eval(parserSource)

export function parse(str: string): exp.Exp {
	return parser.parse(str.trim())
}
