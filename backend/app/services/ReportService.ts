import { DateTime } from 'luxon'
import Report from '#models/report'
import { ReportTypeEnum } from '../enums/report_type_enum.js'

export class ReportService {
	static async create(payload: {
		athleteId: number
		userId: number
		treatmentPlanId?: number
		title: string
		type: ReportTypeEnum
		reportDate: Date
		periodStart?: Date
		periodEnd?: Date
		data: Record<string, any>
		summary?: string
		recommendations?: string
		attachments?: string[]
	}): Promise<Report> {
		const report = await Report.create({
			...payload,
			reportDate: DateTime.fromJSDate(payload.reportDate),
			periodStart: payload.periodStart
				? DateTime.fromJSDate(payload.periodStart)
				: undefined,
			periodEnd: payload.periodEnd
				? DateTime.fromJSDate(payload.periodEnd)
				: undefined,
		})
		return report
	}

	static async update(
		id: number,
		payload: Partial<{
			title: string
			type: ReportTypeEnum
			reportDate: Date
			periodStart: Date
			periodEnd: Date
			data: Record<string, any>
			summary: string
			recommendations: string
			attachments: string[]
		}>,
	): Promise<Report> {
		const report = await Report.findOrFail(id)
		const toMerge: any = { ...payload }

		if (payload.reportDate) {
			toMerge.reportDate = DateTime.fromJSDate(payload.reportDate)
		}

		if (payload.periodStart) {
			toMerge.periodStart = DateTime.fromJSDate(payload.periodStart)
		}

		if (payload.periodEnd) {
			toMerge.periodEnd = DateTime.fromJSDate(payload.periodEnd)
		}

		report.merge(toMerge)
		await report.save()
		return report
	}

	static async delete(id: number): Promise<void> {
		const report = await Report.findOrFail(id)
		await report.delete()
	}

	static async findByAthlete(athleteId: number): Promise<Report[]> {
		return await Report.query()
			.where('athleteId', athleteId)
			.orderBy('reportDate', 'desc')
	}

	static async findByTreatmentPlan(treatmentPlanId: number): Promise<Report[]> {
		return await Report.query()
			.where('treatmentPlanId', treatmentPlanId)
			.orderBy('reportDate', 'desc')
	}

	static async findById(id: number): Promise<Report> {
		return await Report.query()
			.where('id', id)
			.preload('athlete')
			.preload('user')
			.firstOrFail()
	}

	static async generateProgressReport(
		athleteId: number,
		userId: number,
		treatmentPlanId: number,
		periodStart: Date,
		periodEnd: Date,
	): Promise<Report> {
		const report = await ReportService.create({
			athleteId,
			userId,
			treatmentPlanId,
			title: 'Relatório de Progresso',
			type: ReportTypeEnum.PROGRESS,
			reportDate: new Date(),
			periodStart,
			periodEnd,
			data: {},
			summary: 'Relatório gerado automaticamente',
		})
		return report
	}

	static async generateAssessmentReport(
		athleteId: number,
		userId: number,
		assessmentData: Record<string, any>,
	): Promise<Report> {
		const report = await ReportService.create({
			athleteId,
			userId,
			title: 'Relatório de Avaliação',
			type: ReportTypeEnum.ASSESSMENT,
			reportDate: new Date(),
			data: assessmentData,
			summary: 'Relatório de avaliação física',
		})
		return report
	}
}
