import { BaseSchema } from '@adonisjs/lucid/schema'
import { TreatmentPlanStatusEnum } from '../../app/enums/treatment_plan_status_enum.js'

export default class extends BaseSchema {
	protected tableName = 'treatment_plans'

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
				.integer('injury_record_id')
				.unsigned()
				.nullable()
				.references('id')
				.inTable('injury_records')
				.onDelete('SET NULL')
			table.string('diagnosis').notNullable()
			table.text('objectives').notNullable()
			table.text('notes').nullable()
			table.date('start_date').notNullable()
			table.date('end_date').nullable()
			table
				.enum('status', Object.values(TreatmentPlanStatusEnum))
				.defaultTo(TreatmentPlanStatusEnum.DRAFT)
			table.timestamp('created_at', { useTz: true }).notNullable()
			table.timestamp('updated_at', { useTz: true }).notNullable()
		})
	}

	async down() {
		this.schema.dropTable(this.tableName)
	}
}
