import * as os from 'os'
import * as repl from 'repl'

import {parse} from '../parser'

function startRepl() {
	repl.start({
		prompt: '>> ',
		eval(input, context, file, cb) {
			const exp = parse(input)
			cb(null, JSON.stringify(exp))
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
