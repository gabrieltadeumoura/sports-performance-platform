import type { HttpContext } from '@adonisjs/core/http'
import vine from '@vinejs/vine'
import Athlete from '#models/athlete'
import Medication from '#models/medication'
import { MedicationService } from '#services/MedicationService'
import { CreateMedicationSchema } from '#validators/create_medication_schema'
import { UpdateMedicationSchema } from '#validators/update_medication_schema'

export default class MedicationsController {
	public async create({ auth, request, response }: HttpContext) {
		const userId = auth.user!.id
		const data = request.all()
		const payload = await vine.validate({
			schema: CreateMedicationSchema,
			data,
		})

		const athlete = await Athlete.findOrFail(payload.athleteId)
		if (athlete.userId !== userId) {
			return response.status(403).json({ message: 'Acesso negado' })
		}

		const medication = await MedicationService.create(payload)

		return response
			.status(201)
			.json({ status: 201, message: 'Medication created', medication })
	}

	public async listByAthlete({ auth, params, request, response }: HttpContext) {
		const userId = auth.user!.id
		const athlete = await Athlete.findOrFail(params.athleteId)

		if (athlete.userId !== userId) {
			return response.status(403).json({ message: 'Acesso negado' })
		}

		const { isActive } = request.qs()
		const medications = await MedicationService.findByAthlete(
			params.athleteId,
			isActive === 'true' ? true : isActive === 'false' ? false : undefined,
		)

		return response.json({ status: 200, medications })
	}

	public async update({ auth, params, request, response }: HttpContext) {
		const userId = auth.user!.id
		const data = request.all()
		const payload = await vine.validate({
			schema: UpdateMedicationSchema,
			data,
		})

		const medication = await Medication.findOrFail(params.id)
		const athlete = await Athlete.findOrFail(medication.athleteId)

		if (athlete.userId !== userId) {
			return response.status(403).json({ message: 'Acesso negado' })
		}

		const updated = await MedicationService.update(params.id, payload)

		return response.json({
			status: 200,
			message: 'Medication updated',
			medication: updated,
		})
	}

	public async delete({ auth, params, response }: HttpContext) {
		const userId = auth.user!.id

		const medication = await Medication.findOrFail(params.id)
		const athlete = await Athlete.findOrFail(medication.athleteId)

		if (athlete.userId !== userId) {
			return response.status(403).json({ message: 'Acesso negado' })
		}

		await MedicationService.delete(params.id)

		return response.json({ status: 200, message: 'Medication deleted' })
	}

	public async activate({ auth, params, response }: HttpContext) {
		const userId = auth.user!.id

		const medication = await Medication.findOrFail(params.id)
		const athlete = await Athlete.findOrFail(medication.athleteId)

		if (athlete.userId !== userId) {
			return response.status(403).json({ message: 'Acesso negado' })
		}

		const updated = await MedicationService.activate(params.id)

		return response.json({
			status: 200,
			message: 'Medication activated',
			medication: updated,
		})
	}

	public async deactivate({ auth, params, response }: HttpContext) {
		const userId = auth.user!.id

		const medication = await Medication.findOrFail(params.id)
		const athlete = await Athlete.findOrFail(medication.athleteId)

		if (athlete.userId !== userId) {
			return response.status(403).json({ message: 'Acesso negado' })
		}

		const updated = await MedicationService.deactivate(params.id)

		return response.json({
			status: 200,
			message: 'Medication deactivated',
			medication: updated,
		})
	}
}
