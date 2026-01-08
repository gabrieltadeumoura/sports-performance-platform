import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'questionnaire_responses'

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
        .nullable()
        .references('id')
        .inTable('users')
        .onDelete('SET NULL')
      table
        .integer('treatment_plan_id')
        .unsigned()
        .nullable()
        .references('id')
        .inTable('treatment_plans')
        .onDelete('SET NULL')
      table.json('responses').notNullable()
      table.text('notes').nullable()
      table.dateTime('completed_at').notNullable()
      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}