export type Value = Int | Bool

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
