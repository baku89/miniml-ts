import * as Ty from '.'

describe('applySubst', () => {
	test('[X |-> int] (X -> bool) := int -> bool', () => {
		const X = Ty.Var.createFresh()

		const input = new Ty.Fn(X, new Ty.Bool())
		const subst: Ty.Subst = [[X.id, new Ty.Int()]]

		const applied = Ty.substType(input, subst)

		expect(applied.print()).toBe('(int -> bool)')
	})

	test('[Y |-> X -> int, X |-> bool] Y := bool -> int', () => {
		const X = Ty.Var.createFresh()
		const Y = Ty.Var.createFresh()

		const input = Y
		const subst: Ty.Subst = [
			[Y.id, new Ty.Fn(X, new Ty.Int())],
			[X.id, new Ty.Bool()],
		]

		const applied = Ty.substType(input, subst)

		expect(applied.print()).toBe('(bool -> int)')
	})
})

describe('unify', () => {
	test('{X = int, Y = X} => [X |-> int, Y |-> int]', () => {
		const X = Ty.Var.createFresh()
		const Y = Ty.Var.createFresh()

		const eqs: Ty.Constraints = [
			[X, new Ty.Int()],
			[Y, X],
		]

		const subst = Ty.unify(eqs)

		matchSubst(subst, X, new Ty.Int())
		matchSubst(subst, Y, new Ty.Int())
	})

	test('{X = Y, Y = int} => [X |-> Y, Y |-> int]', () => {
		const X = Ty.Var.createFresh()
		const Y = Ty.Var.createFresh()

		const eqs: Ty.Constraints = [
			[X, Y],
			[Y, new Ty.Int()],
		]

		const subst = Ty.unify(eqs)

		matchSubst(subst, X, Y)
		matchSubst(subst, Y, new Ty.Int())
	})

	test('{Y -> Z = X, Y = Z, int = Z} => [X |-> Y -> Z, Y |-> Z, Z |-> int]', () => {
		const X = Ty.Var.createFresh()
		const Y = Ty.Var.createFresh()
		const Z = Ty.Var.createFresh()

		const eqs: Ty.Constraints = [
			[new Ty.Fn(Y, Z), X],
			[Y, Z],
			[new Ty.Int(), Z],
		]

		const subst = Ty.unify(eqs)

		matchSubst(subst, X, new Ty.Fn(Y, Z))
		matchSubst(subst, Y, Z)
		matchSubst(subst, Z, new Ty.Int())
	})
})

function matchSubst(subst: Ty.Subst, tyvar: Ty.Var, expected: Ty.Any) {
	const pair = subst.find(([id]) => id === tyvar.id)

	if (!pair) throw new Error()

	const [, result] = pair

	expect(result.print()).toBe(expected.print())
}
