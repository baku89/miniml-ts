export type Value = Int | Bool

export class Int {
	public type: 'int' = 'int'

	public constructor(public value: number) {}
}

export class Bool {
	public type: 'bool' = 'bool'

	public constructor(public value: boolean) {}
}
