import { BaseSchema } from '@adonisjs/lucid/schema'
import { MediaTypeEnum } from '../../app/enums/media_type_enum.js'

export default class extends BaseSchema {
	protected tableName = 'exercise_media'

	async up() {
		this.schema.createTable(this.tableName, (table) => {
			table.increments('id').primary()
			table
				.integer('exercise_id')
				.unsigned()
				.notNullable()
				.references('id')
				.inTable('exercises')
				.onDelete('CASCADE')
				.index()
			table.enum('type', Object.values(MediaTypeEnum)).notNullable()
			table.string('url').notNullable()
			table.string('thumbnail_url').nullable()
			table.integer('display_order').defaultTo(0)
			table.text('description').nullable()
			table.timestamp('created_at', { useTz: true }).notNullable()
			table.timestamp('updated_at', { useTz: true }).notNullable()
		})
	}

	async down() {
		this.schema.dropTable(this.tableName)
	}
}
