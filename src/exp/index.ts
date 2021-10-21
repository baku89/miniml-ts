export type Exp = Var | Int | Bool | BinOp | If

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

export class BinOp implements IExp {
	public type: 'binOp' = 'binOp'
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
		return `if ${test} then ${consequent} else ${alternate}`
	}
}
