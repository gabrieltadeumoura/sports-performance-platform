import { BaseSchema } from '@adonisjs/lucid/schema'
import { SessionStatusEnum } from '../../app/enums/session_status_enum.js'

export default class extends BaseSchema {
	protected tableName = 'treatment_sessions'

	async up() {
		this.schema.createTable(this.tableName, (table) => {
			table.increments('id').primary()
			table
				.integer('treatment_plan_id')
				.unsigned()
				.notNullable()
				.references('id')
				.inTable('treatment_plans')
				.onDelete('CASCADE')
				.index()
			table
				.integer('athlete_id')
				.unsigned()
				.notNullable()
				.references('id')
				.inTable('athletes')
				.onDelete('CASCADE')
			table
				.integer('user_id')
				.unsigned()
				.notNullable()
				.references('id')
				.inTable('users')
				.onDelete('RESTRICT')
			table.dateTime('session_date').notNullable().index()
			table.enum('type', ['in_person', 'remote']).notNullable()
			table.json('techniques_applied').nullable()
			table.text('observations').nullable()
			table.text('next_steps').nullable()
			table.dateTime('next_session_date').nullable()
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
