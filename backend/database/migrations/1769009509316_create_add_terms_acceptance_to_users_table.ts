import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.timestamp('accepted_terms_at').nullable()
      table.timestamp('accepted_privacy_at').nullable()
      table.string('terms_version', 20).nullable()
      table.string('privacy_version', 20).nullable()
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('accepted_terms_at')
      table.dropColumn('accepted_privacy_at')
      table.dropColumn('terms_version')
      table.dropColumn('privacy_version')
    })
  }
}