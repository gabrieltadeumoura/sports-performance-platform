import { BaseSchema } from '@adonisjs/lucid/schema'
import { ReportTypeEnum } from '../../app/enums/report_type_enum.js'

export default class extends BaseSchema {
  protected tableName = 'reports'

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
      table
        .integer('treatment_plan_id')
        .unsigned()
        .nullable()
        .references('id')
        .inTable('treatment_plans')
        .onDelete('SET NULL')
      table.string('title').notNullable()
      table.enum('type', Object.values(ReportTypeEnum)).notNullable()
      table.date('report_date').notNullable().index()
      table.date('period_start').nullable()
      table.date('period_end').nullable()
      table.json('data').notNullable()
      table.text('summary').nullable()
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