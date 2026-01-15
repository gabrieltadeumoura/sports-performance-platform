import { BaseSchema } from '@adonisjs/lucid/schema'
import { SessionStatusEnum } from '../../app/enums/session_status_enum.js'

export default class extends BaseSchema {
	protected tableName = 'exercise_sessions'

	async up() {
		this.schema.createTable(this.tableName, (table) => {
			table.increments('id').primary()
			table
				.integer('prescribed_exercise_id')
				.unsigned()
				.notNullable()
				.references('id')
				.inTable('prescribed_exercises')
				.onDelete('CASCADE')
				.index()
			table
				.integer('athlete_id')
				.unsigned()
				.notNullable()
				.references('id')
				.inTable('athletes')
				.onDelete('CASCADE')
			table.dateTime('session_date').notNullable().index()
			table.integer('sets_completed').nullable()
			table.integer('repetitions_completed').nullable()
			table.integer('duration_seconds').nullable()
			table.decimal('load_kg', 5, 2).nullable()
			table.integer('pain_level').nullable()
			table.integer('difficulty_level').nullable()
			table.text('observations').nullable()
			table
				.enum('status', Object.values(SessionStatusEnum))
				.defaultTo(SessionStatusEnum.SCHEDULED)
			table.timestamp('created_at', { useTz: true }).notNullable()
			table.timestamp('updated_at', { useTz: true }).notNullable()
		})
	}

	async down() {
		this.schema.dropTable(this.tableName)
	}
}
