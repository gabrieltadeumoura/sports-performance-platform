import type { HttpContext } from '@adonisjs/core/http'
import vine from '@vinejs/vine'
import Athlete from '#models/athlete'
import PrescribedExercise from '#models/prescribed_exercise'
import TreatmentPlan from '#models/treatment_plan'
import { PrescribedExerciseService } from '#services/PrescribedExerciseService'
import { CreatePrescribedExerciseSchema } from '#validators/create_prescribed_exercise_schema'
import { UpdatePrescribedExerciseSchema } from '#validators/update_prescribed_exercise_schema'

export default class PrescribedExercisesController {
	public async create({ auth, request, response }: HttpContext) {
		const userId = auth.user!.id
		const data = request.all()
		const payload = await vine.validate({
			schema: CreatePrescribedExerciseSchema,
			data,
		})

		const plan = await TreatmentPlan.findOrFail(payload.treatmentPlanId)
		const athlete = await Athlete.findOrFail(plan.athleteId)

		if (athlete.userId !== userId) {
			return response.status(403).json({ message: 'Acesso negado' })
		}

		const prescribed = await PrescribedExerciseService.create(payload)

		return response.status(201).json({
			status: 201,
			message: 'Prescribed exercise created successfully',
			prescribedExercise: prescribed,
		})
	}

	public async listByTreatmentPlan({ auth, params, response }: HttpContext) {
		const userId = auth.user!.id
		const plan = await TreatmentPlan.findOrFail(params.treatmentPlanId)
		const athlete = await Athlete.findOrFail(plan.athleteId)

		if (athlete.userId !== userId) {
			return response.status(403).json({ message: 'Acesso negado' })
		}

		const prescribed = await PrescribedExerciseService.findByTreatmentPlan(
			params.treatmentPlanId,
		)

		return response.json({ status: 200, prescribedExercises: prescribed })
	}

	public async update({ auth, params, request, response }: HttpContext) {
		const userId = auth.user!.id
		const data = request.all()
		const payload = await vine.validate({
			schema: UpdatePrescribedExerciseSchema,
			data,
		})

		const prescribed = await PrescribedExercise.findOrFail(params.id)
		const plan = await TreatmentPlan.findOrFail(prescribed.treatmentPlanId)
		const athlete = await Athlete.findOrFail(plan.athleteId)

		if (athlete.userId !== userId) {
			return response.status(403).json({ message: 'Acesso negado' })
		}

		const updated = await PrescribedExerciseService.update(params.id, payload)

		return response.json({
			status: 200,
			message: 'Prescribed exercise updated',
			prescribedExercise: updated,
		})
	}

	public async delete({ auth, params, response }: HttpContext) {
		const userId = auth.user!.id
		const prescribed = await PrescribedExercise.findOrFail(params.id)
		const plan = await TreatmentPlan.findOrFail(prescribed.treatmentPlanId)
		const athlete = await Athlete.findOrFail(plan.athleteId)

		if (athlete.userId !== userId) {
			return response.status(403).json({ message: 'Acesso negado' })
		}

		await PrescribedExerciseService.delete(params.id)

		return response.json({
			status: 200,
			message: 'Prescribed exercise deleted',
		})
	}

	public async activate({ auth, params, response }: HttpContext) {
		const userId = auth.user!.id
		const prescribed = await PrescribedExercise.findOrFail(params.id)
		const plan = await TreatmentPlan.findOrFail(prescribed.treatmentPlanId)
		const athlete = await Athlete.findOrFail(plan.athleteId)

		if (athlete.userId !== userId) {
			return response.status(403).json({ message: 'Acesso negado' })
		}

		const updated = await PrescribedExerciseService.activate(params.id)

		return response.json({
			status: 200,
			message: 'Prescribed exercise activated',
			prescribedExercise: updated,
		})
	}

	public async deactivate({ auth, params, response }: HttpContext) {
		const userId = auth.user!.id
		const prescribed = await PrescribedExercise.findOrFail(params.id)
		const plan = await TreatmentPlan.findOrFail(prescribed.treatmentPlanId)
		const athlete = await Athlete.findOrFail(plan.athleteId)

		if (athlete.userId !== userId) {
			return response.status(403).json({ message: 'Acesso negado' })
		}

		const updated = await PrescribedExerciseService.deactivate(params.id)

		return response.json({
			status: 200,
			message: 'Prescribed exercise deactivated',
			prescribedExercise: updated,
		})
	}
}
