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

export function substType(ty: Any, subst: Subst): Any {
	switch (ty.type) {
		case 'var':
			if (subst.length === 0) return ty
			else {
				const [[id, sub], ...rest] = subst
				if (ty.id === id) return substType(sub, rest)
				return substType(ty, rest)
			}
		case 'fn': {
			const param = substType(ty.param, subst)
			const body = substType(ty.body, subst)
			return new Fn(param, body)
		}
		default:
			return ty
	}
}

function substConstraints(eqs: Constraints, subst: Subst): Constraints {
	if (eqs.length === 0) return []

	const [[t1, t2], ...rest] = eqs

	const t1s = substType(t1, subst)
	const t2s = substType(t2, subst)

	return [[t1s, t2s], ...substConstraints(rest, subst)]
}

export function unify(eqs: Constraints): Subst {
	if (eqs.length === 0) return []

	const [[x, y], ...rest] = eqs

	if (x.print() === y.print()) return unify(rest)

	if (x.type === 'fn' && y.type === 'fn') {
		const param: [Any, Any] = [x.param, y.param]
		const body: [Any, Any] = [x.body, y.body]

		return unify([param, body, ...rest])
	}

	if (x.type === 'var') {
		const ftv = getFreeVars(y)
		if (ftv.has(x.id)) throw new Error('Occur check')

		const restSubst = substConstraints(rest, [[x.id, y]])
		return [[x.id, y], ...unify(restSubst)]
	}

	if (y.type === 'var') {
		return unify([[y, x], ...rest])
	}

	throw new Error('Unable to infer type')
}

function eqsOfSubst(subst: Subst): Constraints {
	return subst.map(([id, ty]) => [new Var(id), ty])
}

export function inferType(exp: Exp.Node, tyenv: Env<Any>): [Subst, Any] {
	switch (exp.type) {
		case 'var': {
			const t = tyenv.lookup(exp.id)
			if (!t) throw new Error('Variable not bound: ' + exp.id)
			return [[], t]
		}
		case 'int':
			return [[], new Int()]
		case 'bool':
			return [[], new Bool()]
		case 'infix': {
			const [sLeft, tyLeft] = inferType(exp.left, tyenv)
			const [sRight, tyRight] = inferType(exp.right, tyenv)
			const [cInfix, tyInfix] = inferInfixType(exp.op, tyLeft, tyRight)
			const eqs = [...eqsOfSubst(sLeft), ...eqsOfSubst(sRight), ...cInfix]
			const s = unify(eqs)
			return [s, substType(tyInfix, s)]
		}
		case 'if': {
			const [sTest, tyTest] = inferType(exp.test, tyenv)
			const [sConseq, tyConseq] = inferType(exp.consequent, tyenv)
			const [sAlt, tyAlt] = inferType(exp.alternate, tyenv)
			const eq1 = eqsOfSubst([...sTest, ...sConseq, ...sAlt])
			const eqs: Constraints = [[tyTest, new Bool()], [tyConseq, tyAlt], ...eq1]
			const s = unify(eqs)
			return [s, substType(tyConseq, s)]
		}
		case 'fn': {
			const tyParam = Var.createFresh()
			const innerTyenv = tyenv.extend(exp.param.id, tyParam)
			const [s, tyBody] = inferType(exp.body, innerTyenv)
			return [s, new Fn(substType(tyParam, s), tyBody)]
		}
		case 'call': {
			const [sFn, tyFn] = inferType(exp.fn, tyenv)
			const [sArg, tyArg] = inferType(exp.arg, tyenv)
			const tyBody = Var.createFresh()
			const eq1 = eqsOfSubst([...sFn, ...sArg])
			const eqs: Constraints = [[tyFn, new Fn(tyArg, tyBody)], ...eq1]
			const s = unify(eqs)
			return [s, substType(tyBody, s)]
		}
		default:
			throw new Error('Not yet implemented')
	}
}

function inferInfixType(
	op: Exp.Infix['op'],
	left: Any,
	right: Any
): [Constraints, Any] {
	switch (op) {
		case '+':
		case '*':
			return [
				[
					[left, new Int()],
					[right, new Int()],
				],
				new Int(),
			]
		case '<':
			return [
				[
					[left, new Int()],
					[right, new Int()],
				],
				new Bool(),
			]
	}
}

export {Any, Int, Bool, Var, Fn}
