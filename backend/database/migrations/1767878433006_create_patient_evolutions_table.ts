import { BaseSchema } from '@adonisjs/lucid/schema'
import { EvolutionTypeEnum } from '../../app/enums/evolution_type_enum.js'

export default class extends BaseSchema {
	protected tableName = 'patient_evolutions'

	async up() {
		this.schema.createTable(this.tableName, (table) => {
			table.increments('id').primary()
			table
				.integer('athlete_id')
				.unsigned()
				.notNullable()
				.references('id')
				.inTable('athletes')
				.onDelete('CASCADE')
				.index()
			table
				.integer('user_id')
				.unsigned()
				.notNullable()
				.references('id')
				.inTable('users')
				.onDelete('RESTRICT')
			table
				.integer('treatment_plan_id')
				.unsigned()
				.nullable()
				.references('id')
				.inTable('treatment_plans')
				.onDelete('SET NULL')
			table.date('evolution_date').notNullable().index()
			table.enum('type', Object.values(EvolutionTypeEnum)).notNullable()
			table.json('metrics').nullable()
			table.decimal('pain_level', 3, 1).nullable()
			table.decimal('range_of_motion', 5, 2).nullable()
			table.decimal('strength_level', 5, 2).nullable()
			table.text('observations').notNullable()
			table.json('attachments').nullable()
			table.timestamp('created_at', { useTz: true }).notNullable()
			table.timestamp('updated_at', { useTz: true }).notNullable()
		})
	}

	async down() {
		this.schema.dropTable(this.tableName)
	}
}
