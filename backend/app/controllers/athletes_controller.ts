import type { HttpContext } from '@adonisjs/core/http'
import redis from '@adonisjs/redis/services/main'
import vine from '@vinejs/vine'
import Athlete from '#models/athlete'
import { AthleteService } from '#services/AthleteService'
import { CreateAthleteSchema } from '#validators/create_athlete_schema'
import DashboardController from './dashboard_controller.js'

export default class AthletesController {
	public async create({ auth, response, request }: HttpContext) {
		const userId = auth.user!.id
		const cacheKey = `athletes:list:${userId}`

		const data = request.only([
			'name',
			'sport',
			'birthDate',
			'height',
			'weight',
			'status',
			'phone',
			'email',
		])

		const payload = await vine.validate({ schema: CreateAthleteSchema, data })

		const athlete = await AthleteService.create({
			...payload,
			userId: auth.user!.id,
		})

		try {
			await redis.del(cacheKey)
			console.log(
				`🗑️ Cache da lista de atletas invalidado para usuário ${userId}`,
			)
			await DashboardController.invalidateDashboardCaches(userId)
		} catch (error) {
			console.error('❌ Erro ao invalidar cache:', error)
		}

		return response.status(201).json({
			status: 201,
			message: 'Athlete created successfully',
			athlete,
		})
	}

	public async update({ auth, params, response, request }: HttpContext) {
		const userId = auth.user!.id
		const athleteId = params.id
		const cacheKey = `athletes:list:${userId}`

		const data = request.only([
			'name',
			'sport',
			'birthDate',
			'height',
			'weight',
			'status',
			'phone',
			'email',
		])

		const payload = await vine.validate({ schema: CreateAthleteSchema, data })

		const athlete = await Athlete.findOrFail(athleteId)

		if (athlete.userId !== userId) {
			return response.status(403).json({ message: 'Acesso negado' })
		}

		athlete.merge(payload)

		await athlete.save()

		try {
			await redis.del(cacheKey)
			console.log(
				`🗑️ Cache da lista de atletas invalidado para usuário ${userId}`,
			)
			await DashboardController.invalidateDashboardCaches(userId)
		} catch (error) {
			console.error('❌ Erro ao invalidar cache:', error)
		}

		return response.status(200).json({
			status: 200,
			message: 'Athlete updated successfully',
			athlete,
		})
	}

	public async delete({ auth, params, response }: HttpContext) {
		const userId = auth.user!.id
		const athleteId = params.id

		const athlete = await Athlete.findOrFail(athleteId)

		if (athlete.userId !== userId) {
			return response.status(403).json({ message: 'Acesso negado' })
		}

		await athlete.delete()

		const listCacheKey = `athletes:list:${userId}`
		const profileCacheKey = `athlete:${athlete.id}:profile:${userId}`

		try {
			await Promise.all([redis.del(listCacheKey), redis.del(profileCacheKey)])
			await DashboardController.invalidateDashboardCaches(userId)
			console.log(
				`🗑️ Caches de lista e perfil invalidados após deletar injuryRecord ${athleteId}`,
			)
		} catch (error) {
			console.error('❌ Erro ao invalidar cache após deletar lesão:', error)
		}

		return response
			.status(200)
			.json({ status: 200, message: 'Athlete deleted successfully' })
	}

	public async listWithCache({ auth, response }: HttpContext) {
		const userId = auth.user!.id
		const cacheKey = `athletes:list:${userId}`

		try {
			const cached = await redis.get(cacheKey)
			if (cached) {
				return response.header('X-Cache', 'HIT').json(JSON.parse(cached))
			}
		} catch (_error) {
			return 'Move on without cached'
		}

		const athletes = await Athlete.query()
			.select([
				'id',
				'name',
				'sport',
				'birthDate',
				'height',
				'weight',
				'status',
				'phone',
				'email',
			])
			.where('userId', userId)
			.preload('injuryRecords', (injuryQuery) => {
				injuryQuery.select([
					'id',
					'athlete_id',
					'injury_type',
					'body_part',
					'severity',
					'status',
					'injury_date',
					'recovery_date',
					'expected_recovery',
					'actual_recovery',
					'treatment_protocol',
					'cause',
					'created_at',
				])
			})
			.orderBy('created_at', 'desc')

		const result = {
			athletes,
			updated_at: new Date().toISOString(),
		}

		try {
			await redis.setex(cacheKey, 300, JSON.stringify(result))
		} catch (_error) {}
		return response.header('X-Cache', 'MISS').json(result)
	}

	public async showAthleteProfileWithInjuryRisk({
		auth,
		params,
		response,
	}: HttpContext) {
		const userId = auth.user!.id
		const athleteId = params.id
		const cacheKey = `athlete:${athleteId}:profile:${userId}`

		try {
			const cached = await redis.get(cacheKey)
			if (cached) {
				return response.header('X-Cache', 'HIT').json(JSON.parse(cached))
			}
		} catch (_error) {}

		const athlete = await Athlete.query()
			.select([
				'id',
				'name',
				'sport',
				'birthDate',
				'height',
				'weight',
				'status',
				'phone',
				'email',
				'userId',
			])
			.where('id', athleteId)
			.where('userId', userId)
			.preload('injuryRecords')
			.firstOrFail()

		const result = {
			athlete: athlete.serialize(),
			cached_at: new Date().toISOString(),
		}

		try {
			await redis.setex(cacheKey, 3600, JSON.stringify(result))
		} catch (_error) {}

		return response.header('X-Cache', 'MISS').json(result)
	}
}
