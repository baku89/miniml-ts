import {Env} from '../env'
import * as exp from '../exp'

export type Value = Int | Bool | Fn

interface IValue {
	print(): string
}

export class Int implements IValue {
	public type: 'int' = 'int'

	public constructor(public value: number) {}

	public print(): string {
		return this.value.toString()
	}
}

export class Bool implements IValue {
	public type: 'bool' = 'bool'

	public constructor(public value: boolean) {}

	public print(): string {
		return this.value ? 'true' : 'false'
	}
}

export class Fn implements IValue {
	public type: 'fn' = 'fn'

	public constructor(
		public param: string,
		public body: exp.Exp,
		public env: Env<Value>
	) {}

	public print(): string {
		return `(fn ${this.param} -> ${this.body.print()})`
	}
}
