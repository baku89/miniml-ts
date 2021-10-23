import * as Ty from './ty'

describe('applySubst', () => {
	test('[(alpha, Int)] (Fn (Var alpha, Bool)) -> Fn (Int, Bool)', () => {
		const alpha = Ty.Var.createFresh()

		const input = new Ty.Fn(alpha, new Ty.Bool())
		const subst: Ty.Subst = [[alpha, new Ty.Int()]]

		const applied = Ty.applySubst(input, subst)

		expect(applied.print()).toBe('(fn int -> bool)')
	})

	test('[(beta, (Fn (Var alpha, Int))); (alpha, Bool)] (Var beta) -> Fn (Bool, Int)', () => {
		const alpha = Ty.Var.createFresh()
		const beta = Ty.Var.createFresh()

		const input = beta
		const subst: Ty.Subst = [
			[beta, new Ty.Fn(alpha, new Ty.Int())],
			[alpha, new Ty.Bool()],
		]

		const applied = Ty.applySubst(input, subst)

		expect(applied.print()).toBe('(fn bool -> int)')
	})
})
