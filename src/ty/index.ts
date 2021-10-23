export type Ty = Int | Bool

interface ITy {
	type: string

	print(): string
}

export class Int implements ITy {
	public type: 'int' = 'int'

	public print() {
		return 'int'
	}
}

export class Bool implements ITy {
	public type: 'bool' = 'bool'

	public print() {
		return 'bool'
	}
}
