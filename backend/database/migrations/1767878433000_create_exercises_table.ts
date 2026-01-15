import { BaseSchema } from '@adonisjs/lucid/schema'
import { BodyRegionEnum } from '../../app/enums/body_region_enum.js'
import { ExerciseCategoryEnum } from '../../app/enums/exercise_category_enum.js'
import { ExerciseDifficultyEnum } from '../../app/enums/exercise_difficulty_enum.js'

export default class extends BaseSchema {
	protected tableName = 'exercises'

	async up() {
		this.schema.createTable(this.tableName, (table) => {
			table.increments('id').primary()
			table.string('name').notNullable()
			table.text('description').nullable()
			table.text('instructions').nullable()
			table.enum('category', Object.values(ExerciseCategoryEnum)).notNullable()
			table.enum('body_region', Object.values(BodyRegionEnum)).notNullable()
			table
				.enum('difficulty', Object.values(ExerciseDifficultyEnum))
				.notNullable()
			table.integer('estimated_duration_minutes').nullable()
			table.text('equipment_needed').nullable()
			table.text('contraindications').nullable()
			table.boolean('is_active').defaultTo(true)
			table.timestamp('created_at', { useTz: true }).notNullable()
			table.timestamp('updated_at', { useTz: true }).notNullable()
		})
	}

	async down() {
		this.schema.dropTable(this.tableName)
	}
}
