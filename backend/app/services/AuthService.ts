import User from '#models/user'
import { HashHelper } from '../utils/hash_password.js'

export class AuthService {
	static async login(payload: { email: string; password: string }) {
		const user = await User.findBy('email', payload.email)
		if (!user) {
			throw new Error('Invalid credentials')
		}

		const isValid = await HashHelper.verify(user.password, payload.password)
		if (!isValid) {
			throw new Error('Invalid credentials')
		}

		const token = await User.accessTokens.create(user)
		return token
	}
}
