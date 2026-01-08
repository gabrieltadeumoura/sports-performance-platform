import vine from '@vinejs/vine'
import { ReportTypeEnum } from '../enums/report_type_enum.js'

export const CreateReportSchema = vine.object({
	athleteId: vine.number().positive(),
	treatmentPlanId: vine.number().positive().optional(),
	title: vine.string().trim().minLength(5),
	type: vine.enum(Object.values(ReportTypeEnum)),
	reportDate: vine.date(),
	periodStart: vine.date().optional(),
	periodEnd: vine.date().optional(),
	data: vine.record(vine.any()),
	summary: vine.string().trim().optional(),
	recommendations: vine.string().trim().optional(),
	attachments: vine.array(vine.string()).optional(),
})
