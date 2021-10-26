import * as Ty from '.'

describe('applySubst', () => {
	test('[(alpha, Int)] (Fn (Var alpha, Bool)) -> Fn (Int, Bool)', () => {
		const alpha = Ty.Var.createFresh()

		const input = new Ty.Fn(alpha, new Ty.Bool())
		const subst: Ty.Subst = [[alpha.id, new Ty.Int()]]

		const applied = Ty.substType(input, subst)

		expect(applied.print()).toBe('(fn int -> bool)')
	})

	test('[(beta, (Fn (Var alpha, Int))); (alpha, Bool)] (Var beta) -> Fn (Bool, Int)', () => {
		const alpha = Ty.Var.createFresh()
		const beta = Ty.Var.createFresh()

		const input = beta
		const subst: Ty.Subst = [
			[beta.id, new Ty.Fn(alpha, new Ty.Int())],
			[alpha.id, new Ty.Bool()],
		]

		const applied = Ty.substType(input, subst)

		expect(applied.print()).toBe('(fn bool -> int)')
	})
})

describe('unify', () => {
	test('[X = Int, Y = X] => [Int |-> X, Int |-> Y]', () => {
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

	test('[X = Y, Y = Int] => [Int |-> Y, Int |-> Y]', () => {
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

	test('[Y -> Z = X, Y = Z, Int = Z] => [(Y -> Z) |-> X, Z |-> Y, Int |-> Z]', () => {
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
