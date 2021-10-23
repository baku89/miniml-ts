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

	private constructor(public id: number) {}

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

export type Subst = [Var, Any][]

export function getFreeVars(ty: Any): Set<Var> {
	switch (ty.type) {
		case 'int':
		case 'bool':
			return new Set()
		case 'var':
			return new Set([ty])
		case 'fn':
			return new Set([...getFreeVars(ty.param), ...getFreeVars(ty.body)])
	}
}

export function applySubst(ty: Any, subst: Subst): Any {
	switch (ty.type) {
		case 'var':
			if (subst.length === 0) return ty
			else {
				const [[tyvar, sub], ...rest] = subst
				if (ty.id === tyvar.id) return applySubst(sub, rest)
				return applySubst(ty, rest)
			}
		case 'fn': {
			const param = applySubst(ty.param, subst)
			const body = applySubst(ty.body, subst)
			return new Fn(param, body)
		}
		default:
			return ty
	}
}
