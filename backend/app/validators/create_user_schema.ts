import vine from '@vinejs/vine'

export const createUserSchema = vine.object({
	name: vine.string().trim().minLength(2).maxLength(100),
	email: vine
		.string()
		.email()
		.normalizeEmail()
		.unique(async (db, value) => {
			const match = await db
				.from('users')
				.select('id')
				.where('email', value)
				.first()
			return !match
		}),
	password: vine.string().minLength(6),
})
