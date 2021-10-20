import {Env} from '../env'
import * as exp from '../exp'
import * as value from '../value'

export function evaluate(exp: exp.Exp, env: Env<value.Value>): value.Value {
	switch (exp.type) {
		case 'var': {
			const v = env.lookup(exp.id)
			if (!v) throw new Error(`Variable not bound:` + exp.id)
			return v
		}
		case 'int':
			return new value.Int(exp.value)
		case 'bool':
			return new value.Bool(exp.value)
		case 'binOp': {
			const left = evaluate(exp.left, env)
			const right = evaluate(exp.right, env)
			return applyBinOp(exp.op, left, right)
		}
		case 'if': {
			const test = evaluate(exp.test, env)
			const stmt = test ? exp.consequent : exp.alternate
			return evaluate(stmt, env)
		}
	}
}

function applyBinOp(
	op: exp.BinOp['op'],
	left: value.Value,
	right: value.Value
): value.Value {
	if (!(left.type === 'int' && right.type === 'int')) {
		throw new Error('Both arguments must be int: ' + op)
	}

	switch (op) {
		case '+':
			return new value.Int(left.value + right.value)
		case '*':
			return new value.Int(left.value * right.value)
		case '<':
			return new value.Bool(left.value < right.value)
	}
}
