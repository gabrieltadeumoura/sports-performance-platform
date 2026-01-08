import bcrypt from 'bcryptjs'

export class HashHelper {
	static async make(password: string, rounds: number = 12): Promise<string> {
		return await bcrypt.hash(password, rounds)
	}

	static async verify(
		hashedPassword: string,
		plainPassword: string,
	): Promise<boolean> {
		return await bcrypt.compare(plainPassword, hashedPassword)
	}
}
