import User from '#models/user'
import { DateTime } from 'luxon'
import type { UserPermissionEnum } from '../enums/user_permission_enum.js'
import { HashHelper } from '../utils/hash_password.js'

export class UserService {
	static async create(payload: {
		name: string
		email: string
		password: string
		acceptedTerms: boolean
	}): Promise<User> {
		const existingUser = await User.findBy('email', payload.email)
		if (existingUser) {
			throw new Error('Email already exists')
		}

		const user = new User()
		user.name = payload.name
		user.email = payload.email
		user.password = await HashHelper.make(payload.password)

		if (payload.acceptedTerms) {
			user.acceptedTermsAt = DateTime.now()
			user.acceptedPrivacyAt = DateTime.now()
			user.termsVersion = '1.0.0'
			user.privacyVersion = '1.0.0'
		}

		await user.save()

		return user
	}

	static async update(
		id: number,
		payload: {
			name?: string
			email?: string
			permission?: UserPermissionEnum
		},
	): Promise<User | null> {
		const user = await User.find(id)
		if (!user) {
			return null
		}
		if (payload.email && payload.email !== user.email) {
			const existingUser = await User.findBy('email', payload.email)
			if (existingUser) {
				throw new Error('Email already exists')
			}
		}

		if (payload.name) user.name = payload.name
		if (payload.email) user.email = payload.email
		if (payload.permission) user.permission = payload.permission

		await user.save()

		return user
	}
}
