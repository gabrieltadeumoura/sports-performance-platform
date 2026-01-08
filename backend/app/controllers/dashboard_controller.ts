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
		} catch (error) {}

		try {
			const [
				totalAthletesResult,
				activeAthletesResult,
				highRiskAthletesResult,
				criticalFatigueAthletes,
				avgVo2,
			] = await Promise.all([
				db
					.from('athletes')
					.where('user_id', userId)
					.count('* as total')
					.first(),
				db
					.from('athletes')
					.where('user_id', userId)
					.where('is_active', true)
					.count('* as total')
					.first(),
				db
					.from('athletes')
					.where('user_id', userId)
					.whereIn('risk_level', ['high', 'critical'])
					.count('* as total')
					.first(),
				db
					.from('vital_signs')
					.join('athletes', 'athletes.id', 'vital_signs.athlete_id')
					.where('athletes.user_id', userId)
					.where('vital_signs.fatigue_score', '>', 85)
					.where(
						'vital_signs.created_at',
						'>',
						new Date(Date.now() - 30 * 60 * 1000),
					)
					.countDistinct('athletes.id as total')
					.first(),
				db
					.from('vital_signs')
					.join('athletes', 'athletes.id', 'vital_signs.athlete_id')
					.where('athletes.user_id', userId)
					.avg('vo2_max as avg_vo2')
					.whereNotNull('vo2_max')
					.first(),
			])
			const data = {
				total_athletes: Number(totalAthletesResult?.total || 0),
				active_athletes: Number(activeAthletesResult?.total || 0),
				high_risk_athletes: Number(highRiskAthletesResult?.total || 0),
				critical_fatigue_athletes: Number(criticalFatigueAthletes?.total || 0),
				avg_vo2_max: Math.round(Number(avgVo2?.avg_vo2 || 0)),
				updated_at: new Date().toISOString(),
			}

			try {
				await redis.setex(cacheKey, 300, JSON.stringify(data))
			} catch (error) {}

			return response.header('X-Cache', 'MISS').json(data)
		} catch (error) {
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
		} catch (error) {}

		try {
			const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)

			const dailyMetrics = await db
				.from('vital_signs')
				.join('athletes', 'athletes.id', 'vital_signs.athlete_id')
				.select(db.raw('DATE(vital_signs.created_at) as date'))
				.avg('vital_signs.fatigue_score as avg_fatigue')
				.avg('vital_signs.vo2_max as avg_vo2')
				.avg('vital_signs.heart_rate as avg_heart_rate')
				.count('vital_signs.id as total_measurements')
				.where('athletes.user_id', userId)
				.where('vital_signs.created_at', '>=', sevenDaysAgo)
				.groupByRaw('DATE(vital_signs.created_at)')
				.orderByRaw('DATE(vital_signs.created_at)')

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
				daily_metrics: dailyMetrics.map((metric) => ({
					date: metric.date,
					avg_fatigue: Math.round(Number(metric.avg_fatigue || 0)),
					avg_vo2: Math.round(Number(metric.avg_vo2 || 0)),
					avg_heart_rate: Math.round(Number(metric.avg_heart_rate || 0)),
					total_measurements: Number(metric.total_measurements),
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
			} catch (error) {}

			return response.header('X-Cache', 'MISS').json(data)
		} catch (error) {
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
		} catch (error) {}

		try {
			const now = new Date()
			const thirtyMinutesAgo = new Date(now.getTime() - 30 * 60 * 1000)

			const criticalFatigueAthletes = await db
				.from('vital_signs')
				.join('athletes', 'athletes.id', 'vital_signs.athlete_id')
				.select([
					'athletes.id',
					'athletes.name',
					'athletes.position',
					'vital_signs.fatigue_score',
					'vital_signs.created_at',
				])
				.where('athletes.user_id', userId)
				.where('vital_signs.fatigue_score', '>', 85)
				.where('vital_signs.created_at', '>', thirtyMinutesAgo)
				.orderBy('vital_signs.fatigue_score', 'desc')

			const highRiskAthletes = await db
				.from('athletes')
				.leftJoin('vital_signs', 'athletes.id', 'vital_signs.athlete_id')
				.select([
					'athletes.id',
					'athletes.name',
					'athletes.position',
					'athletes.risk_level',
				])
				.where('athletes.user_id', userId)
				.where('athletes.risk_level', 'critical')
				.where('athletes.is_active', true)
				.where(
					'vital_signs.created_at',
					'>',
					new Date(now.getTime() - 24 * 60 * 60 * 1000),
				)
				.groupBy([
					'athletes.id',
					'athletes.name',
					'athletes.position',
					'athletes.risk_level',
				])

			const recentInjuries = await db
				.from('injury_records')
				.join('athletes', 'athletes.id', 'injury_records.athlete_id')
				.select([
					'athletes.id',
					'athletes.name',
					'athletes.position',
					'injury_records.injury_type',
					'injury_records.created_at',
				])
				.where('athletes.user_id', userId)
				.whereIn('injury_records.status', ['active', 'recovering'])
				.where(
					'injury_records.created_at',
					'>',
					new Date(now.getTime() - 24 * 60 * 60 * 1000),
				)
				.orderBy('injury_records.created_at', 'desc')

			const data = {
				critical_fatigue: criticalFatigueAthletes.map((athlete) => ({
					athlete_id: athlete.id,
					name: athlete.name,
					position: athlete.position,
					fatigue_score: athlete.fatigue_score,
					alert_type: 'critical_fatigue',
					severity: 'high',
					time_ago: this.getTimeAgo(new Date(athlete.created_at)),
				})),
				high_risk_active: highRiskAthletes.map((athlete) => ({
					athlete_id: athlete.id,
					name: athlete.name,
					position: athlete.position,
					risk_level: athlete.risk_level,
					alert_type: 'high_risk',
					severity: 'medium',
				})),
				recent_injuries: recentInjuries.map((injury) => ({
					athlete_id: injury.id,
					name: injury.name,
					position: injury.position,
					injury_type: injury.injury_type,
					alert_type: 'recent_injury',
					severity: 'medium',
					time_ago: this.getTimeAgo(new Date(injury.created_at)),
				})),
				total_alerts:
					criticalFatigueAthletes.length +
					highRiskAthletes.length +
					recentInjuries.length,
				updated_at: new Date().toISOString(),
			}

			try {
				await redis.setex(cacheKey, 60, JSON.stringify(data))
			} catch (error) {}

			return response.header('X-Cache', 'MISS').json(data)
		} catch (error) {
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
		} catch (error) {}

		try {
			const performanceByPosition = await db
				.from('athletes')
				.leftJoin('vital_signs', 'athletes.id', 'vital_signs.athlete_id')
				.select(['athletes.position'])
				.avg('vital_signs.vo2_max as avg_vo2')
				.avg('vital_signs.fatigue_score as avg_fatigue')
				.count('athletes.id as total_athletes')
				.where('athletes.user_id', userId)
				.where('athletes.is_active', true)
				.where(
					'vital_signs.created_at',
					'>',
					new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
				)
				.groupBy('athletes.position')

			const performanceByTeam = await db
				.from('athletes')
				.leftJoin('vital_signs', 'athletes.id', 'vital_signs.athlete_id')
				.select(['athletes.team'])
				.avg('vital_signs.vo2_max as avg_vo2')
				.avg('vital_signs.fatigue_score as avg_fatigue')
				.count('athletes.id as total_athletes')
				.where('athletes.user_id', userId)
				.where('athletes.is_active', true)
				.where(
					'vital_signs.created_at',
					'>',
					new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
				)
				.groupBy('athletes.team')

			const riskByPosition = await db
				.from('athletes')
				.select(['athletes.position', 'athletes.risk_level'])
				.count('* as count')
				.where('athletes.user_id', userId)
				.where('athletes.is_active', true)
				.groupBy(['athletes.position', 'athletes.risk_level'])

			const data = {
				by_position: performanceByPosition.map((pos) => ({
					position: pos.position,
					avg_vo2: Math.round(Number(pos.avg_vo2 || 0)),
					avg_fatigue: Math.round(Number(pos.avg_fatigue || 0)),
					total_athletes: Number(pos.total_athletes),
					performance_score: this.calculatePerformanceScore(
						pos.avg_vo2,
						pos.avg_fatigue,
					),
				})),
				by_team: performanceByTeam.map((team) => ({
					team: team.team,
					avg_vo2: Math.round(Number(team.avg_vo2 || 0)),
					avg_fatigue: Math.round(Number(team.avg_fatigue || 0)),
					total_athletes: Number(team.total_athletes),
					performance_score: this.calculatePerformanceScore(
						team.avg_vo2,
						team.avg_fatigue,
					),
				})),
				risk_distribution: this.processRiskDistribution(riskByPosition),
				updated_at: new Date().toISOString(),
			}

			try {
				await redis.setex(cacheKey, 600, JSON.stringify(data))
			} catch (error) {}

			return response.header('X-Cache', 'MISS').json(data)
		} catch (error) {
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

	private calculatePerformanceScore(vo2: number, fatigue: number): number {
		const vo2Score = Math.min((vo2 / 60) * 50, 50)
		const fatigueScore = Math.max(50 - (fatigue / 100) * 50, 0)
		return Math.round(vo2Score + fatigueScore)
	}

	private processRiskDistribution(riskData: any[]): any {
		const distribution: any = {}

		riskData.forEach((item) => {
			if (!distribution[item.position]) {
				distribution[item.position] = {
					low: 0,
					medium: 0,
					high: 0,
					critical: 0,
				}
			}
			distribution[item.position][item.risk_level] = Number(item.count)
		})

		return distribution
	}
}
