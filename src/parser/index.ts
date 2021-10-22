import peggy from 'peggy'

import * as exp from '../exp'

const ParserDefinition = `
{
	function foldInfixSequence(head, tail, op) {
		return tail.reduce((left, [,,,right]) => new exp.Infix(left, op, right), head) 
	}
}

Program = _ prog:Exp _
	{
		return prog
	}

Exp = Call / Arg

Arg = Infix / Term

Term = Group / Let / If / Fn / Int / Bool / Var

Reserved = "true" / "false" / "if" / "then" / "else" / "let" / "in" / "fn"

Int = [0-9]+
	{
		const val = parseInt(text())
		return new exp.Int(val)
	}

Bool = ("true" / "false")
	{
		const val = text() === 'true'
		return new exp.Bool(val)
	}

Var = !(Reserved End) $([a-zA-Z_] [a-zA-Z0-9_]*)
	{
		return new exp.Var(text())
	}

Group = "(" _ exp:Exp _ ")"
	{
		return exp
	}

If = "if" _ test:Exp _ "then" _ consequent:Exp _ "else" _ alternate:Exp
	{
		return new exp.If(test, consequent, alternate)
	}

Let = "let" _ name:Var _ "=" _ value:Exp _ "in" _ body:Exp
	{
		return new exp.Let(name, value, body)
	}

Fn = "fn" _ param:Var _ "->" _ body:Exp
	{
		return new exp.Fn(param, body)
	}

Call = head:Term tail:(__ Arg)+
	{
		return tail.reduce((fn, [,arg]) => new exp.Call(fn, arg), head)
	}

Infix = LessThan / Additive / Multitive

LessThan = head:(Additive / Term) tail:(_ "<" _ (Additive / Call / Term))+
	{
		return foldInfixSequence(head, tail, '<')
	}

Additive = head:(Multitive / Term) tail:(_ "+" _ (Multitive / Call / Term))+
	{
		return foldInfixSequence(head, tail, '+')
	}

Multitive = head:Term tail:(_ "*" _ (Call / Term))+
	{
		return foldInfixSequence(head, tail, '*')
	}

_ = Whitespace*
__ = Whitespace+

Whitespace = $[ \\t\\n\\r]
EOF = !.
End = EOF / __

`

const parserSource = peggy.generate(ParserDefinition, {
	exportVar: {exp},
	output: 'source',
})

const parser = eval(parserSource)

export function parse(str: string): exp.Exp {
	return parser.parse(str.trim())
}
