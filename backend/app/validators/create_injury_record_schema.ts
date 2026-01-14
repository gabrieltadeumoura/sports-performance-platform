import vine from '@vinejs/vine'
import { SeverityInjuryEnum } from '../enums/severity_injury_enum.js'
import { StatusInjuryRecordEnum } from '../enums/status_injury_record_enum.js'

export const CreateInjuryRecordSchema = vine.object({
	athleteId: vine.number(),
	injuryType: vine.string(),
	bodyPart: vine.string(),
	severity: vine.enum(Object.values(SeverityInjuryEnum)),
	cause: vine.string(),
	expectedRecovery: vine.number(),
	actualRecovery: vine.number().nullable().optional(),
	treatmentProtocol: vine.string(),
	status: vine.enum(Object.values(StatusInjuryRecordEnum)),
	injuryDate: vine.date({ formats: ['iso8601'] }),
	recoveryDate: vine.date({ formats: ['iso8601'] }).nullable().optional(),
})
