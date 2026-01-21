import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import type { DateTime } from 'luxon'
import type { ChatMessageStatusEnum } from '../enums/chat_message_status_enum.js'
import type { ChatMessageTypeEnum } from '../enums/chat_message_type_enum.js'
import User from './user.js'

export default class ChatMessage extends BaseModel {
	@column({ isPrimary: true })
	declare id: number

	@column()
	declare userId: number

	@column()
	declare conversationId: string

	@column()
	declare query: string

	@column()
	declare response: string | null

	@column()
	declare type: ChatMessageTypeEnum

	@column()
	declare status: ChatMessageStatusEnum

	@column()
	declare metadata: Record<string, any> | null

	@column()
	declare processingTimeMs: number | null

	@column.dateTime({ autoCreate: true })
	declare createdAt: DateTime

	@column.dateTime({ autoCreate: true, autoUpdate: true })
	declare updatedAt: DateTime

	@belongsTo(() => User)
	declare user: BelongsTo<typeof User>
}
