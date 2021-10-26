export type Any = Int | Bool | Var | Fn

interface ITy {
	type: string

	print(): string
}

export class Int implements ITy {
	public type: 'int' = 'int'

	public print() {
		return 'int'
	}
}

export class Bool implements ITy {
	public type: 'bool' = 'bool'

	public print() {
		return 'bool'
	}
}

export class Var implements ITy {
	public type: 'var' = 'var'

	public constructor(public id: number) {}

	public print(): string {
		return `(tyvar ${this.id})`
	}

	public static createFresh = (() => {
		let counter = 0

		return function () {
			return new Var(counter++)
		}
	})()
}

export class Fn implements ITy {
	public type: 'fn' = 'fn'

	public constructor(public param: Any, public body: Any) {}

	public print(): string {
		return `(fn ${this.param.print()} -> ${this.body.print()})`
	}
}
