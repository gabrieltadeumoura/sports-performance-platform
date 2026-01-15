import { BaseSchema } from '@adonisjs/lucid/schema'
import { UserPermissionEnum } from '../../app/enums/user_permission_enum.js'

export default class extends BaseSchema {
	protected tableName = 'users'

	async up() {
		this.schema.createTable(this.tableName, (table) => {
			table.increments('id').notNullable()
			table
				.enum('permission', Object.values(UserPermissionEnum))
				.defaultTo(UserPermissionEnum.admin)
			table.string('name').notNullable()
			table.string('email', 254).notNullable().unique()
			table.string('password').notNullable()
			table.timestamp('created_at').notNullable()
			table.timestamp('updated_at').nullable()
		})
	}

	async down() {
		this.schema.dropTable(this.tableName)
	}
}
