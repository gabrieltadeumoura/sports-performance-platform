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
			'position',
			'age',
			'height',
			'weight',
			'team',
			'isActive',
			'riskLevel',
			'biomechanicsProfile',
			'currentInjuries',
		])

		const payload = await vine.validate({ schema: CreateAthleteSchema, data })

		const athlete = await AthleteService.create({
			...payload,
			biomechanicsProfile: JSON.stringify(payload.biomechanicsProfile),
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
			'position',
			'age',
			'height',
			'weight',
			'team',
			'isActive',
			'riskLevel',
			'biomechanicsProfile',
			'currentInjuries',
		])

		const payload = await vine.validate({ schema: CreateAthleteSchema, data })

		const athlete = await Athlete.findOrFail(athleteId)

		if (athlete.userId !== userId) {
			return response.status(403).json({ message: 'Acesso negado' })
		}

		athlete.merge({
			...payload,
			biomechanicsProfile: JSON.stringify(payload.biomechanicsProfile),
		})

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
		} catch (error) {
			return 'Move on without cached'
		}

		const athletes = await Athlete.query()
			.select([
				'id',
				'name',
				'position',
				'team',
				'age',
				'height',
				'weight',
				'riskLevel',
				'isActive',
			])
			.where('isActive', true)
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
			.limit(5)

		const result = {
			athletes,
			updated_at: new Date().toISOString(),
		}

		try {
			await redis.setex(cacheKey, 300, JSON.stringify(result))
		} catch (error) {}
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
		} catch (error) {}

		const athlete = await Athlete.query()
			.select([
				'id',
				'name',
				'position',
				'team',
				'age',
				'height',
				'weight',
				'riskLevel',
				'isActive',
				'userId',
			])
			.where('id', athleteId)
			.where('userId', userId)
			.preload('injuryRecords')
			.firstOrFail()

		const injuryRisk = athlete.calculateInjuryRisk()
		const result = {
			...athlete.serialize(),
			injury_risk_score: injuryRisk,
			cached_at: new Date().toISOString(),
		}

		try {
			await redis.setex(cacheKey, 3600, JSON.stringify(result))
		} catch (error) {}

		return response.header('X-Cache', 'MISS').json(result)
	}

	public async analyzeBiomechanicalProfile({
		auth,
		params,
		response,
	}: HttpContext) {
		const userId = auth.user!.id
		const cacheKey = `athlete:${params.id}:biomechanics:${userId}`

		try {
			const cached = await redis.get(cacheKey)
			if (cached) {
				return response.header('X-Cache', 'HIT').json(JSON.parse(cached))
			}
		} catch (error) {}

		const athlete = await Athlete.query()
			.where('id', params.id)
			.where('userId', userId)
			.firstOrFail()
		const profile = JSON.parse(athlete.biomechanicsProfile || '{}')

		const analysis = {
			athlete_id: athlete.id,
			asymmetry_score: profile.asymmetry || 0,
			flexibility_score: profile.flexibility || 0,
			strength_balance: profile.strength_balance || 0,
			movement_quality: profile.movement_quality || 0,
			recommendations: this.generateRehabilitationSuggestions(profile),
			injury_risk: athlete.calculateInjuryRisk(),
			next_assessment: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
			cached_at: new Date().toISOString(),
		}

		try {
			await redis.setex(cacheKey, 1800, JSON.stringify(analysis))
		} catch (error) {}

		return response.header('X-Cache', 'MISS').json(analysis)
	}

	private generateRehabilitationSuggestions(profile: any): string[] {
		const suggestions: string[] = []

		if (profile.asymmetry > 15) {
			suggestions.push('Unilateral strength exercises')
			suggestions.push('Stretching focused on dominant side')
		}

		if (profile.flexibility < 70) {
			suggestions.push('Daily flexibility routine')
			suggestions.push('Myofascial release before training')
		}

		if (profile.strength_imbalance > 20) {
			suggestions.push('Eccentric strength training')
			suggestions.push('Advanced proprioceptive training')
		}

		return suggestions
	}
}
