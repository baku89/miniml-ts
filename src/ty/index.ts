import {Env} from '../env'
import * as Exp from '../exp'
import {Any, Bool, Fn, Int, Var} from './ty'

export type Subst = [number, Any][]
export type Constraints = [Any, Any][]

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

export function unify(constraints: Constraints): Subst {
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

export function inferType(exp: Exp.Node, tyenv: Env<Any>): Any {
	switch (exp.type) {
		case 'var': {
			const t = tyenv.lookup(exp.id)
			if (!t) throw new Error('Variable not bound: ' + exp.id)
			return t
		}
		case 'int':
			return new Int()
		case 'bool':
			return new Bool()
		case 'infix': {
			const left = inferType(exp.left, tyenv)
			const right = inferType(exp.right, tyenv)
			return inspectInfixType(exp.op, left, right)
		}
		default:
			throw new Error('Not yet implemented')
	}
}

function inspectInfixType(op: Exp.Infix['op'], left: Any, right: Any) {
	if (left.type === 'int' && right.type === 'int') {
		return new Int()
	}
	throw new Error('Both arguments must be integer: ' + op)
}

export {Any, Int, Bool, Var, Fn}
