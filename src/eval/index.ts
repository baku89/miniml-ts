import {Env} from '../env'
import * as Exp from '../exp'
import * as Value from '../value'

export function evaluate(exp: Exp.Node, env: Env<Value.Value>): Value.Value {
	switch (exp.type) {
		case 'var': {
			const v = env.lookup(exp.id)
			if (!v) throw new Error(`Variable not bound: ` + exp.id)
			return v
		}
		case 'int':
			return new Value.Int(exp.value)
		case 'bool':
			return new Value.Bool(exp.value)
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

				const fn = new Value.Fn(val.param.id, val.body, innerEnv)
				innerEnv.set(name.id, fn)
			}

			return evaluate(exp.body, innerEnv)
		}
		case 'fn': {
			return new Value.Fn(exp.param.id, exp.body, env)
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
	op: Exp.Infix['op'],
	left: Value.Value,
	right: Value.Value
): Value.Value {
	if (!(left.type === 'int' && right.type === 'int')) {
		throw new Error('Both arguments must be int: ' + op)
	}

	switch (op) {
		case '+':
			return new Value.Int(left.value + right.value)
		case '*':
			return new Value.Int(left.value * right.value)
		case '<':
			return new Value.Bool(left.value < right.value)
	}
}
