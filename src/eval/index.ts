import {Env} from '../env'
import {Exp, Infix} from '../exp'
import * as value from '../value'

export function evaluate(exp: Exp, env: Env<value.Value>): value.Value {
	switch (exp.type) {
		case 'var': {
			const v = env.lookup(exp.id)
			if (!v) throw new Error(`Variable not bound: ` + exp.id)
			return v
		}
		case 'int':
			return new value.Int(exp.value)
		case 'bool':
			return new value.Bool(exp.value)
		case 'infix': {
			const left = evaluate(exp.left, env)
			const right = evaluate(exp.right, env)
			return applyInfix(exp.op, left, right)
		}
		case 'if': {
			const test = evaluate(exp.test, env)
			if (test.type !== 'bool') {
				throw new Error(
					'Test expression must be boolean value, but got: ' + test.print()
				)
			}
			const stmt = test.value ? exp.consequent : exp.alternate
			return evaluate(stmt, env)
		}
		case 'let': {
			let innerEnv = env

			for (const [name, val] of exp.pairs) {
				const evaluated = evaluate(val, env)
				innerEnv = innerEnv.extend(name.id, evaluated)
			}

			return evaluate(exp.body, innerEnv)
		}
		case 'letRec': {
			const innerEnv = env.clone()

			for (const [name, val] of exp.pairs) {
				if (val.type !== 'fn') {
					throw new Error('let rec for non-functional value is not supported')
				}

				const fn = new value.Fn(val.param.id, val.body, innerEnv)
				innerEnv.set(name.id, fn)
			}

			return evaluate(exp.body, innerEnv)
		}
		case 'fn': {
			return new value.Fn(exp.param.id, exp.body, env)
		}
		case 'call': {
			const fn = evaluate(exp.fn, env)
			if (fn.type !== 'fn') throw new Error('Non-function value is applied')

			const arg = evaluate(exp.arg, env)
			const fnEnv = fn.env.extend(fn.param, arg)

			return evaluate(fn.body, fnEnv)
		}
	}
}

function applyInfix(
	op: Infix['op'],
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
