import type { HttpContext } from '@adonisjs/core/http'
import vine from '@vinejs/vine'
import { AuthService } from '#services/AuthService'
import { loginSchema } from '#validators/login_schema'

export default class AuthController {
	async login({ request, response }: HttpContext) {
		const data = request.only(['email', 'password'])
		const payload = await vine.validate({ schema: loginSchema, data })

		const tokenInstance = await AuthService.login(payload)

		const token = tokenInstance.toJSON().token

		response.cookie('auth_token', token, {
			httpOnly: true,
			sameSite: 'lax',
			secure: false,
			path: '/',
			maxAge: 60 * 60 * 24 * 7 * 1000,
		})

		return response.ok({ status: 200, token })
	}
}
