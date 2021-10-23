import peggy from 'peggy'

import * as Exp from '../exp'

const ParserDefinition = `
{
	function foldInfixSequence(head, tail, op) {
		return tail.reduce((left, [,,,right]) => new Exp.Infix(left, op, right), head) 
	}
}

Program = _ prog:Node _
	{
		return prog
	}

Node = LessThan / Term

Term = LetRec / Let / If / Fn / Int / Bool / Var / Group

Int = [0-9]+
	{
		const val = parseInt(text())
		return new Exp.Int(val)
	}

Bool = ("true" / "false")
	{
		const val = text() === 'true'
		return new Exp.Bool(val)
	}

Reserved = "true" / "false" / "if" / "then" / "else" / "let" / "rec" / "and" / "in" / "fn"

Var = v:(AlphabeticalVar / InfixVar)
	{
		return v
	}

AlphabeticalVar = !(Reserved End) $([a-zA-Z_] [a-zA-Z0-9_]*)
	{
		return new Exp.Var(text())
	}

InfixVar = "(" _ name:$("+" / "-" / "*" / "/" / ">" / "<" / "=")+ _ ")"
	{
		return new Exp.Var(name)
	}

Group = "(" _ node:Node _ ")"
	{
		return node
	}

If = "if" _ test:Node _ "then" _ consequent:Node _ "else" _ alternate:Node
	{
		return new Exp.If(test, consequent, alternate)
	}

Let = "let" _ pairs:LetDeclarations _ "in" _ body:Node
	{
		return new Exp.Let(pairs, body)
	}

LetRec = "let" _ "rec" _ pairs:LetDeclarations _ "in" _ body:Node
{
	return new Exp.LetRec(pairs, body)
}

LetDeclarations = head:Assign tail:(_ "and" _ Assign)*
	{
		return [head, ...(tail.map(t => t[3]))]
	}

Assign = VarAssign / FnAssign

VarAssign = name:Var _ "=" _ value:Node
	{
		return [name, value]
	}

FnAssign = name:Var params:(_ Var)+ _ "=" _ body:Node
	{
		const paramVars = params.map(p => p[1])
		const fn = paramVars.reduceRight((body, param) => new Exp.Fn(param, body), body)
		return [name, fn]
	}

Fn = "fn" _ param:Var _ "->" _ body:Node
	{
		return new Exp.Fn(param, body)
	}

LessThan = head:Additive tail:(_ "<" _ Additive)+
	{
		return foldInfixSequence(head, tail, '<')
	}
	/ Additive

Additive = head:Multitive tail:(_ "+" _ Multitive)+
	{
		return foldInfixSequence(head, tail, '+')
	}
	/ Multitive

Multitive = head:Call tail:(_ "*" _ Call)+
	{
		return foldInfixSequence(head, tail, '*')
	}
	/ Call

Call = head:Term tail:(__ Term)+
	{
		return tail.reduce((fn, [,arg]) => new Exp.Call(fn, arg), head)
	}
	/ Term

_ = Whitespace*
__ = Whitespace+

Whitespace = $[ \\t\\n\\r]
EOF = !.
End = EOF / __

`

const parserSource = peggy.generate(ParserDefinition, {
	exportVar: {exp: Exp},
	output: 'source',
})

const parser = eval(parserSource)

export function parse(str: string): Exp.Node {
	return parser.parse(str.trim())
}
