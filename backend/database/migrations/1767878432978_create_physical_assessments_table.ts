import { BaseSchema } from '@adonisjs/lucid/schema'
import { AssessmentTypeEnum } from '../../app/enums/type_physical_assessment.js'

export default class extends BaseSchema {
	protected tableName = 'physical_assessments'

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
			table.date('assessment_date').notNullable().index()
			table.enum('type', Object.values(AssessmentTypeEnum))
			table.json('range_of_motion').nullable()
			table.json('muscle_strength').nullable()
			table.json('functional_tests').nullable()
			table.json('postural_assessment').nullable()
			table.integer('weight').nullable()
			table.integer('height').nullable()
			table.decimal('body_fat_percentage', 5, 2).nullable()
			table.text('observations').nullable()
			table.text('limitations').nullable()
			table.text('recommendations').nullable()
			table.json('attachments').nullable()
			table.timestamp('created_at', { useTz: true }).notNullable()
			table.timestamp('updated_at', { useTz: true }).notNullable()
		})
	}

	async down() {
		this.schema.dropTable(this.tableName)
	}
}
