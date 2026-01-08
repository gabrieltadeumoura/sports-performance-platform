import { DateTime } from 'luxon'
import InjuryRecord from '#models/injuryrecord'
import type { SeverityInjuryEnum } from '../enums/severity_injury_enum.js'
import type { StatusInjuryRecordEnum } from '../enums/status_injury_record_enum.js'

export class InjuryRecordService {
	static async create(payload: {
		athleteId: number
		injuryType: string
		bodyPart: string
		severity: SeverityInjuryEnum
		cause: string
		expectedRecovery: number
		actualRecovery: number
		treatmentProtocol: string
		status: StatusInjuryRecordEnum
		injuryDate: Date
		recoveryDate: Date
	}): Promise<InjuryRecord> {
		const injuryRecord = new InjuryRecord()

		injuryRecord.athleteId = payload.athleteId
		injuryRecord.injuryType = payload.injuryType
		injuryRecord.bodyPart = payload.bodyPart
		injuryRecord.severity = payload.severity
		injuryRecord.cause = payload.cause
		injuryRecord.expectedRecovery = payload.expectedRecovery
		injuryRecord.actualRecovery = payload.actualRecovery
		injuryRecord.treatmentProtocol = payload.treatmentProtocol
		injuryRecord.status = payload.status
		injuryRecord.injuryDate = DateTime.fromJSDate(payload.injuryDate)
		injuryRecord.recoveryDate = DateTime.fromJSDate(payload.recoveryDate)

		await injuryRecord.save()

		return injuryRecord
	}

	// static async update(
	//   id: number,
	//   payload: {
	//     injuryType?: string
	//     severity?: SeverityInjuryEnum
	//     actualRecovery?: number
	//     status?: StatusInjuryRecordEnum
	//     injuryDate?: Date
	//   }
	// ): Promise<InjuryRecord | null> {
	//   const athlete = Athlete.find(id)
	//   if(!athlete) return null

	// }
	// return
}
