import * as os from 'os'
import * as repl from 'repl'

import {Env} from '../env'
import {evaluate} from '../eval'
import {parse} from '../parser'
import {inspectType} from '../ty'

function startRepl() {
	repl.start({
		prompt: '# ',
		eval(input, context, file, cb) {
			const exp = parse(input)
			const env = Env.createGlobal()
			const val = evaluate(exp, env)
			const ty = inspectType(exp, Env.createTy())
			cb(null, `val ${val.print()} : ${ty.print()}`)
		},
		writer: v => v,
	})
}

function main() {
	console.log(
		`Hello ${os.userInfo().username}! This is the Monkey programming language!`
	)
	startRepl()
}

main()
