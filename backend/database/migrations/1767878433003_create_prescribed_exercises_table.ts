import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'prescribed_exercises'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table
        .integer('treatment_plan_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('treatment_plans')
        .onDelete('CASCADE')
        .index()
      table
        .integer('exercise_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('exercises')
        .onDelete('RESTRICT')
      table.integer('sets').notNullable()
      table.integer('repetitions').nullable()
      table.integer('duration_seconds').nullable()
      table.integer('rest_seconds').nullable()
      table.string('frequency').notNullable()
      table.integer('display_order').defaultTo(0)
      table.text('instructions').nullable()
      table.text('notes').nullable()
      table.boolean('is_active').defaultTo(true)
      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}