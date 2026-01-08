import type { HttpContext } from '@adonisjs/core/http'
import redis from '@adonisjs/redis/services/main'
import vine from '@vinejs/vine'
import { DateTime } from 'luxon'
import Athlete from '#models/athlete'
import InjuryRecord from '#models/injuryrecord'
import { InjuryRecordService } from '#services/InjuryRecordService'
import { CreateInjuryRecordSchema } from '#validators/create_injury_record_schema'
import DashboardController from './dashboard_controller.js'

export default class InjuryRecordsController {
	public async create({ response, request }: HttpContext) {
		const data = request.only([
			'athleteId',
			'injuryType',
			'bodyPart',
			'severity',
			'cause',
			'expectedRecovery',
			'actualRecovery',
			'treatmentProtocol',
			'status',
			'injuryDate',
			'recoveryDate',
		])

		const payload = await vine.validate({
			schema: CreateInjuryRecordSchema,
			data,
		})

		const injuryRecord = await InjuryRecordService.create(payload)

		const athlete = await Athlete.find(injuryRecord.athleteId)
		if (athlete) {
			const userId = athlete.userId
			const cacheKey = `athletes:list:${userId}`

			try {
				await redis.del(cacheKey)
				console.log(
					`🗑️ Cache da lista de atletas invalidado para usuário ${userId} após criar sinal vital`,
				)

				await DashboardController.invalidateDashboardCaches(userId)
			} catch (error) {
				console.error(
					'❌ Erro ao invalidar cache após criar sinal vital:',
					error,
				)
			}
		}

		return response.status(201).json({
			status: 201,
			message: 'Injury Record created successfully',
			injuryRecord,
		})
	}

	public async update({ auth, params, response, request }: HttpContext) {
		const userId = auth.user!.id
		const injuryId = params.id

		const data = request.only([
			'athleteId',
			'injuryType',
			'bodyPart',
			'severity',
			'cause',
			'expectedRecovery',
			'actualRecovery',
			'treatmentProtocol',
			'status',
			'injuryDate',
			'recoveryDate',
		])

		const payload = await vine.validate({
			schema: CreateInjuryRecordSchema,
			data,
		})

		const toMerge: any = { ...payload }

		const injury = await InjuryRecord.findOrFail(injuryId)

		const athlete = await Athlete.findOrFail(injury.athleteId)

		if (athlete.userId !== userId) {
			return response.status(403).json({ message: 'Acesso negado' })
		}

		if (payload.injuryDate !== undefined)
			toMerge.injuryDate = this.toDateTime(payload.injuryDate as any)
		if (payload.recoveryDate !== undefined)
			toMerge.recoveryDate = this.toDateTime(payload.recoveryDate as any)
		injury.merge(toMerge)
		await injury.save()

		const listCacheKey = `athletes:list:${userId}`
		const profileCacheKey = `athlete:${athlete.id}:profile:${userId}`
		const vitalsCacheKey = `athlete:${athlete.id}:vitals:${userId}`

		try {
			await Promise.all([
				redis.del(listCacheKey),
				redis.del(profileCacheKey),
				redis.del(vitalsCacheKey),
			])
			await DashboardController.invalidateDashboardCaches(userId)
			console.log(
				`🗑️ Caches de lista, perfil e vitals invalidados após atualizar vitalSign ${injuryId}`,
			)
		} catch (error) {
			console.error('❌ Erro ao invalidar cache de vital sign:', error)
		}

		return response.status(200).json({
			status: 200,
			message: 'Injury record updated successfully',
			injury,
		})
	}

	public async delete({ auth, params, response }: HttpContext) {
		const userId = auth.user!.id
		const injuryId = params.id

		const injury = await InjuryRecord.findOrFail(injuryId)

		const athlete = await Athlete.findOrFail(injury.athleteId)
		if (athlete.userId !== userId) {
			return response.status(403).json({ message: 'Acesso negado' })
		}

		await injury.delete()

		const listCacheKey = `athletes:list:${userId}`
		const profileCacheKey = `athlete:${athlete.id}:profile:${userId}`

		try {
			await Promise.all([redis.del(listCacheKey), redis.del(profileCacheKey)])
			await DashboardController.invalidateDashboardCaches(userId)
			console.log(
				`🗑️ Caches de lista e perfil invalidados após deletar injuryRecord ${injuryId}`,
			)
		} catch (error) {
			console.error('❌ Erro ao invalidar cache após deletar lesão:', error)
		}

		return response
			.status(200)
			.json({ status: 200, message: 'Injury record deleted successfully' })
	}

	private toDateTime(value?: Date | string) {
		if (!value) return undefined
		if (value instanceof Date) return DateTime.fromJSDate(value)
		return DateTime.fromISO(value)
	}
}
