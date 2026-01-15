import type { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'
import redis from '@adonisjs/redis/services/main'

export default class DashboardController {
	public static async invalidateDashboardCaches(userId: number): Promise<void> {
		const cacheKeys = [
			`dashboard:overview:${userId}`,
			`dashboard:trends:${userId}`,
			`dashboard:alerts:${userId}`,
			`dashboard:team-performance:${userId}`,
		]

		try {
			console.log(`🗑️ Invalidando caches do dashboard para usuário ${userId}`)

			for (const cacheKey of cacheKeys) {
				try {
					await redis.del(cacheKey)
					console.log(`✅ Cache invalidado: ${cacheKey}`)
				} catch (error) {
					console.error(`❌ Erro ao invalidar cache ${cacheKey}:`, error)
				}
			}

			console.log(
				`🎯 Todos os caches do dashboard invalidados para usuário ${userId}`,
			)
		} catch (error) {
			console.error('❌ Erro geral ao invalidar caches do dashboard:', error)
		}
	}

	public async getOverviewDashboardMetrics({ auth, response }: HttpContext) {
		const userId = auth.user!.id
		const cacheKey = `dashboard:overview:${userId}`

		try {
			const cached = await redis.get(cacheKey)
			if (cached) {
				return response.header('X-Cache', 'HIT').json(JSON.parse(cached))
			}
		} catch (_error) {}

		try {
			const [
				totalAthletesResult,
				activeAthletesResult,
				treatmentAthletesResult,
				recentInjuriesResult,
				_recentAssessmentsResult,
			] = await Promise.all([
				db
					.from('athletes')
					.where('user_id', userId)
					.count('* as total')
					.first(),
				db
					.from('athletes')
					.where('user_id', userId)
					.where('status', 'active')
					.count('* as total')
					.first(),
				db
					.from('athletes')
					.where('user_id', userId)
					.where('status', 'treatment')
					.count('* as total')
					.first(),
				db
					.from('injury_records')
					.join('athletes', 'athletes.id', 'injury_records.athlete_id')
					.where('athletes.user_id', userId)
					.where('injury_records.status', 'active')
					.where(
						'injury_records.created_at',
						'>',
						new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
					)
					.countDistinct('athletes.id as total')
					.first(),
				db
					.from('physical_assessments')
					.join('athletes', 'athletes.id', 'physical_assessments.athlete_id')
					.where('athletes.user_id', userId)
					.where(
						'physical_assessments.created_at',
						'>',
						new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
					)
					.count('* as total')
					.first(),
			])
			const data = {
				total_athletes: Number(totalAthletesResult?.total || 0),
				active_athletes: Number(activeAthletesResult?.total || 0),
				high_risk_athletes: Number(treatmentAthletesResult?.total || 0),
				critical_fatigue_athletes: Number(recentInjuriesResult?.total || 0),
				avg_vo2_max: 0,
				updated_at: new Date().toISOString(),
			}

			try {
				await redis.setex(cacheKey, 300, JSON.stringify(data))
			} catch (_error) {}

			return response.header('X-Cache', 'MISS').json(data)
		} catch (error) {
			console.error('Error fetching dashboard overview:', error)
			return response.status(500).json({
				error: 'Failed to fetch dashboard metrics',
				message: 'An error occurred while retrieving dashboard data',
			})
		}
	}

	public async getTrendingMetrics({ auth, response }: HttpContext) {
		const userId = auth.user!.id
		const cacheKey = `dashboard:trends:${userId}`

		try {
			const cached = await redis.get(cacheKey)
			if (cached) {
				return response.header('X-Cache', 'HIT').json(JSON.parse(cached))
			}
		} catch (_error) {}

		try {
			const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)

			const assessmentTrends = await db
				.from('physical_assessments')
				.join('athletes', 'athletes.id', 'physical_assessments.athlete_id')
				.select(db.raw('DATE(physical_assessments.created_at) as date'))
				.avg('physical_assessments.body_fat_percentage as avg_body_fat')
				.avg('physical_assessments.weight as avg_weight')
				.count('physical_assessments.id as total_assessments')
				.where('athletes.user_id', userId)
				.where('physical_assessments.created_at', '>=', sevenDaysAgo)
				.groupByRaw('DATE(physical_assessments.created_at)')
				.orderByRaw('DATE(physical_assessments.created_at)')

			const injuryTrends = await db
				.from('injury_records')
				.join('athletes', 'athletes.id', 'injury_records.athlete_id')
				.select(db.raw('DATE(injury_records.created_at) as date'))
				.count('injury_records.id as new_injuries')
				.where('athletes.user_id', userId)
				.where('injury_records.created_at', '>=', sevenDaysAgo)
				.groupByRaw('DATE(injury_records.created_at)')
				.orderByRaw('DATE(injury_records.created_at)')

			const data = {
				daily_metrics: assessmentTrends.map((metric) => ({
					date: metric.date,
					avg_fatigue: 0,
					avg_vo2: 0,
					avg_heart_rate: 0,
					total_measurements: Number(metric.total_assessments),
				})),
				injury_trends: injuryTrends.map((injury) => ({
					date: injury.date,
					new_injuries: Number(injury.new_injuries),
				})),
				period: '7_days',
				updated_at: new Date().toISOString(),
			}

			try {
				await redis.setex(cacheKey, 1800, JSON.stringify(data))
			} catch (_error) {}

			return response.header('X-Cache', 'MISS').json(data)
		} catch (error) {
			console.error('Error fetching dashboard trends:', error)
			return response.status(500).json({
				error: 'Failed to fetch trending metrics',
				message: 'An error occurred while retrieving trend data',
			})
		}
	}

	public async getCriticalAlerts({ auth, response }: HttpContext) {
		const userId = auth.user!.id
		const cacheKey = `dashboard:alerts:${userId}`

		try {
			const cached = await redis.get(cacheKey)
			if (cached) {
				return response.header('X-Cache', 'HIT').json(JSON.parse(cached))
			}
		} catch (_error) {}

		try {
			const now = new Date()
			const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000)

			const treatmentAthletes = await db
				.from('athletes')
				.select(['athletes.id', 'athletes.name', 'athletes.status'])
				.where('athletes.user_id', userId)
				.where('athletes.status', 'treatment')

			const recentInjuries = await db
				.from('injury_records')
				.join('athletes', 'athletes.id', 'injury_records.athlete_id')
				.select([
					'athletes.id',
					'athletes.name',
					'injury_records.injury_type',
					'injury_records.severity',
					'injury_records.created_at',
				])
				.where('athletes.user_id', userId)
				.whereIn('injury_records.status', ['active', 'recovering'])
				.where('injury_records.created_at', '>', oneDayAgo)
				.orderBy('injury_records.created_at', 'desc')

			const criticalInjuries = await db
				.from('injury_records')
				.join('athletes', 'athletes.id', 'injury_records.athlete_id')
				.select([
					'athletes.id',
					'athletes.name',
					'injury_records.injury_type',
					'injury_records.severity',
					'injury_records.created_at',
				])
				.where('athletes.user_id', userId)
				.whereIn('injury_records.severity', ['severe', 'critical'])
				.whereIn('injury_records.status', ['active', 'recovering'])
				.where('injury_records.created_at', '>', oneDayAgo)
				.orderBy('injury_records.created_at', 'desc')

			const data = {
				critical_fatigue: criticalInjuries.map((injury) => {
					const createdAt = injury.created_at
						? typeof injury.created_at === 'string'
							? new Date(injury.created_at)
							: injury.created_at instanceof Date
								? injury.created_at
								: new Date(injury.created_at)
						: new Date()
					return {
						athlete_id: injury.id,
						name: injury.name,
						injury_type: injury.injury_type,
						alert_type: 'critical_fatigue',
						severity: 'high',
						time_ago: this.getTimeAgo(createdAt),
					}
				}),
				high_risk_active: treatmentAthletes.map((athlete) => ({
					athlete_id: athlete.id,
					name: athlete.name,
					alert_type: 'high_risk',
					severity: 'medium',
				})),
				recent_injuries: recentInjuries.map((injury) => {
					const createdAt = injury.created_at
						? typeof injury.created_at === 'string'
							? new Date(injury.created_at)
							: injury.created_at instanceof Date
								? injury.created_at
								: new Date(injury.created_at)
						: new Date()
					return {
						athlete_id: injury.id,
						name: injury.name,
						injury_type: injury.injury_type,
						alert_type: 'recent_injury',
						severity:
							injury.severity === 'severe' || injury.severity === 'critical'
								? 'high'
								: 'medium',
						time_ago: this.getTimeAgo(createdAt),
					}
				}),
				total_alerts: treatmentAthletes.length + recentInjuries.length,
				updated_at: new Date().toISOString(),
			}

			try {
				await redis.setex(cacheKey, 60, JSON.stringify(data))
			} catch (_error) {}

			return response.header('X-Cache', 'MISS').json(data)
		} catch (error) {
			console.error('Error fetching dashboard alerts:', error)
			return response.status(500).json({
				error: 'Failed to fetch critical alerts',
				message: 'An error occurred while retrieving alerts',
			})
		}
	}

	public async getTeamPerformance({ auth, response }: HttpContext) {
		const userId = auth.user!.id
		const cacheKey = `dashboard:team-performance:${userId}`

		try {
			const cached = await redis.get(cacheKey)
			if (cached) {
				return response.header('X-Cache', 'HIT').json(JSON.parse(cached))
			}
		} catch (_error) {}

		try {
			const performanceBySport = await db
				.from('athletes')
				.select(['athletes.sport'])
				.count('* as total_athletes')
				.where('athletes.user_id', userId)
				.where('athletes.status', 'active')
				.groupBy('athletes.sport')

			const statusDistribution = await db
				.from('athletes')
				.select(['athletes.status'])
				.count('* as count')
				.where('athletes.user_id', userId)
				.groupBy('athletes.status')

			const data = {
				by_position: [],
				by_team: performanceBySport.map((sport) => ({
					team: sport.sport,
					avg_vo2: 0,
					avg_fatigue: 0,
					total_athletes: Number(sport.total_athletes),
					performance_score: 0,
				})),
				risk_distribution: this.processStatusDistribution(statusDistribution),
				updated_at: new Date().toISOString(),
			}

			try {
				await redis.setex(cacheKey, 600, JSON.stringify(data))
			} catch (_error) {}

			return response.header('X-Cache', 'MISS').json(data)
		} catch (error) {
			console.error('Error fetching team performance:', error)
			return response.status(500).json({
				error: 'Failed to fetch team performance',
				message: 'An error occurred while retrieving team data',
			})
		}
	}

	private getTimeAgo(date: Date): string {
		const now = new Date()
		const diffInMinutes = Math.floor(
			(now.getTime() - date.getTime()) / (1000 * 60),
		)

		if (diffInMinutes < 60) {
			return `${diffInMinutes} min ago`
		} else if (diffInMinutes < 1440) {
			return `${Math.floor(diffInMinutes / 60)} h ago`
		} else {
			return `${Math.floor(diffInMinutes / 1440)} days ago`
		}
	}

	// TODO: Método reservado para cálculo de performance no futuro
	// private calculatePerformanceScore(vo2: number, fatigue: number): number {
	// 	const vo2Score = Math.min((vo2 / 60) * 50, 50)
	// 	const fatigueScore = Math.max(50 - (fatigue / 100) * 50, 0)
	// 	return Math.round(vo2Score + fatigueScore)
	// }

	private processStatusDistribution(statusData: any[]): any {
		const distribution: any = {
			all: {
				active: 0,
				treatment: 0,
				removed: 0,
				released: 0,
			},
		}

		statusData.forEach((item) => {
			if (distribution.all[item.status] !== undefined) {
				distribution.all[item.status] = Number(item.count)
			}
		})

		return distribution
	}
}
