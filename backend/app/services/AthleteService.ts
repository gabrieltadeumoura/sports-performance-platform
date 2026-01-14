import Athlete from '#models/athlete'
import type { StatusAthleteEnum } from '../enums/status_athlete_enum.js'

export class AthleteService {
	static async create(payload: {
		userId: number
		name: string
		sport: string
		birthDate: number
		height: number | null
		weight: number | null
		status: StatusAthleteEnum
		phone: string | null
		email: string
	}): Promise<Athlete> {
		const existingAthlete = await Athlete.query()
			.where('name', payload.name)
			.andWhere('email', payload.email)
			.andWhere('userId', payload.userId)
			.first()
		if (existingAthlete) {
			throw new Error('Athlete already exists')
		}

		const athlete = new Athlete()
		athlete.userId = payload.userId
		athlete.name = payload.name
		athlete.sport = payload.sport
		athlete.birthDate = payload.birthDate
		athlete.height = payload.height
		athlete.weight = payload.weight
		athlete.status = payload.status
		athlete.phone = payload.phone
		athlete.email = payload.email

		await athlete.save()

		return athlete
	}
}
