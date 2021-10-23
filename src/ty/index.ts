import {Env} from '../env'
import * as Exp from '../exp'
import {Any, Bool, Fn, Int, Var} from './ty'

export function inspectType(exp: Exp.Node, tyenv: Env<Any>): Any {
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
			const left = inspectType(exp.left, tyenv)
			const right = inspectType(exp.right, tyenv)
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
