import { BaseSchema } from '@adonisjs/lucid/schema'
import { QuestionnaireTypeEnum } from '../../app/enums/questionnaire_type_enum.js'

export default class extends BaseSchema {
  protected tableName = 'questionnaires'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('title').notNullable()
      table.text('description').nullable()
      table.enum('type', Object.values(QuestionnaireTypeEnum)).notNullable()
      table.boolean('is_active').defaultTo(true)
      table.integer('display_order').defaultTo(0)
      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}