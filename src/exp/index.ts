export type Exp = Var | Int | Bool | Infix | If | Let | LetRec | Fn | Call

export type Type = Exp['type']

interface IExp {
	type: string

	print(): string
}

export class Var implements IExp {
	public type: 'var' = 'var'
	public constructor(public id: string) {}

	public print() {
		return this.id
	}
}

export class Int implements IExp {
	public type: 'int' = 'int'
	public constructor(public value: number) {}

	public print() {
		return this.value.toString()
	}
}

export class Bool implements IExp {
	public type: 'bool' = 'bool'
	public constructor(public value: boolean) {}

	public print() {
		return this.value.toString()
	}
}

export class Infix implements IExp {
	public type: 'infix' = 'infix'
	public constructor(
		public left: Exp,
		public op: '+' | '*' | '<',
		public right: Exp
	) {}

	public print(): string {
		return `(${this.left.print()} ${this.op} ${this.right.print()})`
	}
}

export class If implements IExp {
	public type: 'if' = 'if'
	public constructor(
		public test: Exp,
		public consequent: Exp,
		public alternate: Exp
	) {}

	public print(): string {
		const test = this.test.print()
		const consequent = this.consequent.print()
		const alternate = this.alternate.print()
		return `(if ${test} then ${consequent} else ${alternate})`
	}
}

export class Let implements IExp {
	public type: 'let' = 'let'

	public constructor(public pairs: [Var, Exp][], public body: Exp) {}

	public print(): string {
		const declarations = this.pairs
			.map(([n, e]) => `${n.print()} = ${e.print()}`)
			.join(' and ')

		const body = this.body.print()
		return `(let ${declarations} in ${body})`
	}
}

export class LetRec implements IExp {
	public type: 'letRec' = 'letRec'

	public constructor(public pairs: [Var, Exp][], public body: Exp) {}

	public print(): string {
		const declarations = this.pairs
			.map(([n, e]) => `${n.print()} = ${e.print()}`)
			.join(' and ')

		const body = this.body.print()
		return `(let rec ${declarations} in ${body})`
	}
}

export class Fn implements IExp {
	public type: 'fn' = 'fn'

	public constructor(public param: Var, public body: Exp) {}

	public print(): string {
		const param = this.param.print()
		const body = this.body.print()

		return `(fn ${param} -> ${body})`
	}
}

export class Call implements IExp {
	public type: 'call' = 'call'

	public constructor(public fn: Exp, public arg: Exp) {}

	public print(): string {
		const fn = this.fn.print()
		const arg = this.arg.print()

		return `(${fn} ${arg})`
	}
}
