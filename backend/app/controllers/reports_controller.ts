import type { HttpContext } from '@adonisjs/core/http'
import vine from '@vinejs/vine'
import Athlete from '#models/athlete'
import Report from '#models/report'
import { ReportService } from '#services/ReportService'
import { CreateReportSchema } from '#validators/create_report_schema'

export default class ReportsController {
	public async create({ auth, request, response }: HttpContext) {
		const userId = auth.user!.id
		const data = request.all()
		const payload = await vine.validate({ schema: CreateReportSchema, data })

		const athlete = await Athlete.findOrFail(payload.athleteId)
		if (athlete.userId !== userId) {
			return response.status(403).json({ message: 'Acesso negado' })
		}

		const report = await ReportService.create({ ...payload, userId })

		return response
			.status(201)
			.json({ status: 201, message: 'Report created', report })
	}

	public async list({ auth, response }: HttpContext) {
		const userId = auth.user!.id

		const athletes = await Athlete.query().where('userId', userId).select('id')
		const athleteIds = athletes.map((a) => a.id)

		const reports = await Report.query()
			.whereIn('athleteId', athleteIds)
			.preload('athlete')
			.orderBy('reportDate', 'desc')

		return response.json({ status: 200, reports })
	}

	public async show({ auth, params, response }: HttpContext) {
		const userId = auth.user!.id

		const report = await ReportService.findById(params.id)

		const athlete = await Athlete.findOrFail(report.athleteId)
		if (athlete.userId !== userId) {
			return response.status(403).json({ message: 'Acesso negado' })
		}

		return response.json({ status: 200, report })
	}

	public async delete({ auth, params, response }: HttpContext) {
		const userId = auth.user!.id

		const report = await Report.findOrFail(params.id)
		const athlete = await Athlete.findOrFail(report.athleteId)

		if (athlete.userId !== userId) {
			return response.status(403).json({ message: 'Acesso negado' })
		}

		await ReportService.delete(params.id)

		return response.json({ status: 200, message: 'Report deleted' })
	}

	public async listByAthlete({ auth, params, response }: HttpContext) {
		const userId = auth.user!.id
		const athlete = await Athlete.findOrFail(params.athleteId)

		if (athlete.userId !== userId) {
			return response.status(403).json({ message: 'Acesso negado' })
		}

		const reports = await ReportService.findByAthlete(params.athleteId)

		return response.json({ status: 200, reports })
	}

	public async listByTreatmentPlan({ params, response }: HttpContext) {
		const reports = await ReportService.findByTreatmentPlan(
			params.treatmentPlanId,
		)

		return response.json({ status: 200, reports })
	}

	public async generateProgress({ auth, request, response }: HttpContext) {
		const userId = auth.user!.id
		const { athleteId, treatmentPlanId, periodStart, periodEnd } = request.only(
			['athleteId', 'treatmentPlanId', 'periodStart', 'periodEnd'],
		)

		const athlete = await Athlete.findOrFail(athleteId)
		if (athlete.userId !== userId) {
			return response.status(403).json({ message: 'Acesso negado' })
		}

		const report = await ReportService.generateProgressReport(
			athleteId,
			userId,
			treatmentPlanId,
			new Date(periodStart),
			new Date(periodEnd),
		)

		return response
			.status(201)
			.json({ status: 201, message: 'Progress report generated', report })
	}

	public async generateAssessment({ auth, request, response }: HttpContext) {
		const userId = auth.user!.id
		const { athleteId, assessmentData } = request.only([
			'athleteId',
			'assessmentData',
		])

		const athlete = await Athlete.findOrFail(athleteId)
		if (athlete.userId !== userId) {
			return response.status(403).json({ message: 'Acesso negado' })
		}

		const report = await ReportService.generateAssessmentReport(
			athleteId,
			userId,
			assessmentData,
		)

		return response
			.status(201)
			.json({ status: 201, message: 'Assessment report generated', report })
	}
}
