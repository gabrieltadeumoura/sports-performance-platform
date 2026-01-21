import { DbAccessTokensProvider } from '@adonisjs/auth/access_tokens'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import type { DateTime } from 'luxon'
import type { UserPermissionEnum } from '../enums/user_permission_enum.js'
import Athlete from './athlete.js'
import ChatMessage from './chat_message.js'

export default class User extends BaseModel {
	@column({ isPrimary: true })
	declare id: number

	@column()
	declare permission: UserPermissionEnum

	@column()
	declare name: string

	@column()
	declare email: string

	@column({ serializeAs: null })
	declare password: string

	@column.dateTime({ autoCreate: true })
	declare createdAt: DateTime

	@column.dateTime({ autoCreate: true, autoUpdate: true })
	declare updatedAt: DateTime | null

	@hasMany(() => Athlete)
	declare athletes: HasMany<typeof Athlete>

	@hasMany(() => ChatMessage)
	declare chatMessages: HasMany<typeof ChatMessage>

	static accessTokens = DbAccessTokensProvider.forModel(User)
}
