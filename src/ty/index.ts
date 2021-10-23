import {Env} from '../env'
import * as Exp from '../exp'
import {Bool, Int, Ty} from './ty'

export function inspectType(exp: Exp.Exp, tyenv: Env<Ty>): Ty {
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

function inspectInfixType(op: Exp.Infix['op'], left: Ty, right: Ty) {
	if (left.type === 'int' && right.type === 'int') {
		return new Int()
	}
	throw new Error('Both arguments must be integer: ' + op)
}

export {Ty, Int, Bool}
