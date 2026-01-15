import { BaseSchema } from '@adonisjs/lucid/schema'
import { QuestionTypeEnum } from '../../app/enums/question_type_enum.js'

export default class extends BaseSchema {
	protected tableName = 'questionnaire_questions'

	async up() {
		this.schema.createTable(this.tableName, (table) => {
			table.increments('id').primary()
			table
				.integer('questionnaire_id')
				.unsigned()
				.notNullable()
				.references('id')
				.inTable('questionnaires')
				.onDelete('CASCADE')
				.index()
			table.text('question_text').notNullable()
			table.enum('question_type', Object.values(QuestionTypeEnum)).notNullable()
			table.json('options').nullable()
			table.boolean('is_required').defaultTo(false)
			table.integer('display_order').defaultTo(0)
			table.text('help_text').nullable()
			table.timestamp('created_at', { useTz: true }).notNullable()
			table.timestamp('updated_at', { useTz: true }).notNullable()
		})
	}

	async down() {
		this.schema.dropTable(this.tableName)
	}
}
