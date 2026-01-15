import { BaseSchema } from '@adonisjs/lucid/schema'
import { SeverityInjuryEnum } from '../../app/enums/severity_injury_enum.js'
import { StatusInjuryRecordEnum } from '../../app/enums/status_injury_record_enum.js'

export default class extends BaseSchema {
	protected tableName = 'injury_records'

	async up() {
		this.schema.createTable(this.tableName, (table) => {
			table.increments('id')
			table
				.integer('athlete_id')
				.unsigned()
				.references('id')
				.inTable('athletes')
				.onDelete('CASCADE')
			table.string('injury_type').notNullable()
			table.string('body_part').notNullable()
			table.enum('severity', Object.values(SeverityInjuryEnum)).notNullable()
			table.string('cause').notNullable()
			table.integer('expected_recovery').notNullable()
			table.integer('actual_recovery').nullable()
			table.text('treatment_protocol').notNullable()
			table.enum('status', Object.values(StatusInjuryRecordEnum)).notNullable()
			table.timestamp('injury_date').notNullable()
			table.timestamp('recovery_date').nullable()
			table.timestamp('created_at')
			table.timestamp('updated_at')
		})
	}

	async down() {
		this.schema.dropTable(this.tableName)
	}
}
