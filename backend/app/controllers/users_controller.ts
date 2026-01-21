import type { HttpContext } from '@adonisjs/core/http'
import vine from '@vinejs/vine'
import { UserService } from '#services/UserService'
import { createUserSchema } from '#validators/create_user_schema'

export default class UsersController {
	async createUser({ request, response }: HttpContext) {
		const data = request.only(['name', 'email', 'password', 'acceptedTerms'])

		const payload = await vine.validate({ schema: createUserSchema, data })

		const user = await UserService.create({
			name: payload.name,
			email: payload.email,
			password: payload.password,
			acceptedTerms: payload.acceptedTerms,
		})

		return response.status(201).json({
			status: 201,
			message: 'User created successfully',
			user,
		})
	}
}
