import vine from '@vinejs/vine'
import { SeverityInjuryEnum } from '../enums/severity_injury_enum.js'
import { StatusInjuryRecordEnum } from '../enums/status_injury_record_enum.js'

export const CreateInjuryRecordSchema = vine.object({
	injuryType: vine.string(),
	severity: vine.enum(Object.values(SeverityInjuryEnum)),
	actualRecovery: vine.number(),
	status: vine.enum(Object.values(StatusInjuryRecordEnum)),
	injuryDate: vine.date(),
})
