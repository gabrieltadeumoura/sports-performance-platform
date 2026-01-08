import { BaseSchema } from '@adonisjs/lucid/schema'
import { AppointmentStatusEnum } from '../../app/enums/appointment_status_enum.js'
import { AppointmentTypeEnum } from '../../app/enums/appointment_type_enum.js'

export default class extends BaseSchema {
  protected tableName = 'appointments'

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
        .index()
      table
        .integer('treatment_plan_id')
        .unsigned()
        .nullable()
        .references('id')
        .inTable('treatment_plans')
        .onDelete('SET NULL')
      table.dateTime('appointment_date').notNullable().index()
      table.integer('duration_minutes').defaultTo(60)
      table.enum('type', Object.values(AppointmentTypeEnum)).notNullable()
      table.enum('status', Object.values(AppointmentStatusEnum)).defaultTo(AppointmentStatusEnum.SCHEDULED)
      table.text('notes').nullable()
      table.text('reason').nullable()
      table.text('observations').nullable()
      table.boolean('reminder_sent').defaultTo(false)
      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}