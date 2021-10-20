export type Exp = Var | Int | Bool | BinOp | If

interface IExp {
	type: string
}

export class Program implements IExp {
	public type: 'program' = 'program'
	public constructor(public exp: Exp) {}
}

export class Var implements IExp {
	public type: 'var' = 'var'
	public constructor(public id: string) {}
}

export class Int implements IExp {
	public type: 'int' = 'int'
	public constructor(public value: number) {}
}

export class Bool implements IExp {
	public type: 'bool' = 'bool'
	public constructor(public value: boolean) {}
}

export class BinOp implements IExp {
	public type: 'binOp' = 'binOp'
	public constructor(
		public left: Exp,
		public op: '+' | '*' | '<',
		public right: Exp
	) {}
}

export class If implements IExp {
	public type: 'if' = 'if'
	public constructor(
		public test: Exp,
		public consequent: Exp,
		public alternate: Exp
	) {}
}
