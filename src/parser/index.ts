import peggy from 'peggy'

import * as exp from '../exp'

const ParserDefinition = `
Program = _ prog:Exp _
	{
		return prog
	}

Exp = BinOp / Primary

Primary = Group / If / Int / Bool

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

Group = "(" _ exp:Exp _ ")"
	{
		return exp
	}

BinOp = LessThan / Additive / Multitive

LessThan = left:(Additive / Primary) _ op:"<" _ right:(LessThan / Additive / Primary)
	{
		return new exp.BinOp(left, op, right)
	}

Additive = left:(Multitive / Primary) _ op:"+" _ right:(Additive / Multitive / Primary)
	{
		return new exp.BinOp(left, op, right)
	}

Multitive = left:Primary _ op:"*" _ right:(Multitive / Primary)
	{
		return new exp.BinOp(left, op, right)
	}

_ "whitespace" = $[ ,\\t\\n\\r]*
`

const parserSource = peggy.generate(ParserDefinition, {
	exportVar: {exp},
	output: 'source',
})

const parser = eval(parserSource)

export function parse(str: string): exp.Exp {
	return parser.parse(str.trim())
}
