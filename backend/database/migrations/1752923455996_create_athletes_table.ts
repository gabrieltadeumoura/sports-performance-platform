import { BaseSchema } from '@adonisjs/lucid/schema'
import { StatusAthleteEnum } from '../../app/enums/status_athlete_enum.js'

export default class extends BaseSchema {
  protected tableName = 'athletes'

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
      table.string('name').notNullable()
      table.string('sport').notNullable()
      table.integer('birth_date').notNullable()
      table.integer('height').nullable()
      table.integer('weight').nullable()
      table.enum('status', Object.values(StatusAthleteEnum)).notNullable()
      table.string('phone').nullable()
      table.string('email').notNullable()
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
