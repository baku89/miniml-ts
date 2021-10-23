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

export type Subst = [number, Any][]

export function getFreeVars(ty: Any): Set<number> {
	switch (ty.type) {
		case 'int':
		case 'bool':
			return new Set()
		case 'var':
			return new Set([ty.id])
		case 'fn':
			return new Set([...getFreeVars(ty.param), ...getFreeVars(ty.body)])
	}
}

export function applySubst(ty: Any, subst: Subst): Any {
	switch (ty.type) {
		case 'var':
			if (subst.length === 0) return ty
			else {
				const [[id, sub], ...rest] = subst
				if (ty.id === id) return applySubst(sub, rest)
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

export function unify(constraints: [Any, Any][]): Subst {
	if (constraints.length === 0) return []

	const [[x, y], ...rest] = constraints

	if (x.print() === y.print()) return unify(rest)

	if (x.type === 'fn' && y.type === 'fn') {
		const param: [Any, Any] = [x.param, y.param]
		const body: [Any, Any] = [x.body, y.body]

		return unify([param, body, ...rest])
	}

	if (x.type === 'var') {
		const ftv = getFreeVars(y)
		if (ftv.has(x.id)) throw new Error('Occur check')
	}

	if (y.type === 'var') {
		return unify([[y, x], ...rest])
	}

	throw new Error('Unable to infer type')
}
