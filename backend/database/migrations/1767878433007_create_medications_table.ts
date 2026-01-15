import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
	protected tableName = 'medications'

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
			table.string('name').notNullable()
			table.string('dosage').nullable()
			table.string('frequency').nullable()
			table.text('instructions').nullable()
			table.string('prescribed_by').nullable()
			table.date('start_date').notNullable()
			table.date('end_date').nullable()
			table.boolean('is_active').defaultTo(true)
			table.text('notes').nullable()
			table.timestamp('created_at', { useTz: true }).notNullable()
			table.timestamp('updated_at', { useTz: true }).notNullable()
		})
	}

	async down() {
		this.schema.dropTable(this.tableName)
	}
}
