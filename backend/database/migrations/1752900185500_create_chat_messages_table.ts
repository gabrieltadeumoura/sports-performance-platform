import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
	protected tableName = 'chat_messages'

	async up() {
		this.schema.createTable(this.tableName, (table) => {
			table.increments('id')
			table
				.integer('user_id')
				.unsigned()
				.references('id')
				.inTable('users')
				.onDelete('CASCADE')
				.notNullable()
			table.uuid('conversation_id').notNullable()
			table.text('query').notNullable()
			table.text('response').nullable()
			table.string('type', 50).notNullable().defaultTo('query')
			table.string('status', 50).notNullable().defaultTo('pending')
			table.jsonb('metadata').nullable()
			table.integer('processing_time_ms').nullable()
			table.timestamp('created_at')
			table.timestamp('updated_at')

			// Indexes
			table.index('user_id', 'idx_chat_messages_user_id')
			table.index('conversation_id', 'idx_chat_messages_conversation_id')
			table.index('created_at', 'idx_chat_messages_created_at')
		})
	}

	async down() {
		this.schema.dropTable(this.tableName)
	}
}
