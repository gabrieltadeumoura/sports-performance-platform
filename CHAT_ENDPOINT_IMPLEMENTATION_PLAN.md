# Plano de Implementação: Chat Endpoint API

## 1. **Feature Overview**

### O que resolve?
Criar um endpoint de chat que recebe queries (perguntas/mensagens) de usuários autenticados e retorna respostas, permitindo interação conversacional com o sistema.

### Para quem?
Usuários autenticados da plataforma (fisioterapeutas, treinadores) que precisam de assistência ou consultas rápidas sobre atletas, tratamentos, exercícios, etc.

### Funcionalidade chave
- Receber mensagens/queries via POST
- Processar a query de forma segura
- Retornar resposta estruturada
- Manter histórico de conversas por usuário
- Suporte para diferentes tipos de queries (informação, ação, análise)

---

## 2. **Technical Design**

```
┌─────────────┐      ┌─────────────┐      ┌──────────────┐      ┌──────────────┐
│   Cliente   │─────▶│ POST /api/  │─────▶│   Chat       │─────▶│  PostgreSQL  │
│  (Frontend) │◀─────│ v1/chat     │◀─────│  Service     │◀─────│  (Messages)  │
└─────────────┘      └─────────────┘      └──────────────┘      └──────────────┘
                            │                      │
                            │                      │
                            ▼                      ▼
                     ┌─────────────┐      ┌──────────────┐
                     │    Auth     │      │    Redis     │
                     │ Middleware  │      │   (Cache)    │
                     └─────────────┘      └──────────────┘
```

### Component Structure

**Backend:**
- **Route**: `POST /api/v1/chat` (authenticated)
- **Controller**: `ChatController.send()`
- **Service**: `ChatService.processQuery()`
- **Validator**: `SendChatMessageSchema`
- **Model**: `ChatMessage` (Lucid ORM)
- **Enum**: `ChatMessageTypeEnum`, `ChatMessageStatusEnum`

### API Endpoint Design

**Endpoint:** `POST /api/v1/chat`

**Request:**
```typescript
{
  "query": "Como está o progresso do atleta João?",
  "context": "dashboard", // optional
  "conversationId": "uuid-v4", // optional, para continuar conversa
  "metadata": { // optional
    "athleteId": 123,
    "source": "dashboard"
  }
}
```

**Response (201):**
```typescript
{
  "status": 201,
  "message": "Message processed successfully",
  "chatMessage": {
    "id": 1,
    "userId": 5,
    "conversationId": "uuid-v4",
    "query": "Como está o progresso do atleta João?",
    "response": "O atleta João está em progresso...",
    "type": "query",
    "status": "completed",
    "metadata": {...},
    "createdAt": "2024-01-20T10:00:00.000Z"
  }
}
```

**Response (Error):**
```typescript
{
  "status": 400,
  "message": "Invalid query format",
  "errors": [...]
}
```

### Database Schema

**Table: `chat_messages`**
```sql
CREATE TABLE chat_messages (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  conversation_id UUID NOT NULL,
  query TEXT NOT NULL,
  response TEXT,
  type VARCHAR(50) NOT NULL DEFAULT 'query',
  status VARCHAR(50) NOT NULL DEFAULT 'pending',
  metadata JSONB,
  processing_time_ms INTEGER,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_chat_messages_user_id ON chat_messages(user_id);
CREATE INDEX idx_chat_messages_conversation_id ON chat_messages(conversation_id);
CREATE INDEX idx_chat_messages_created_at ON chat_messages(created_at DESC);
```

### State Management
- Messages são armazenados no banco por usuário
- Cache de conversas recentes no Redis (últimas 10 mensagens)
- TTL do cache: 1 hora

---

## 3. **Implementation Plan**

### **Phase 1: Foundation** (Preparação)

- [ ] Criar migration para tabela `chat_messages`
- [ ] Criar enums: `ChatMessageTypeEnum` e `ChatMessageStatusEnum`
- [ ] Criar model `ChatMessage` com relacionamento para `User`
- [ ] Criar validator `SendChatMessageSchema` com VineJS
- [ ] Configurar tipos TypeScript para payloads

### **Phase 2: Core Feature** (Implementação principal)

- [ ] Criar `ChatService` com método `processQuery()`
- [ ] Implementar lógica de geração de `conversationId` (UUID v4)
- [ ] Implementar método para salvar mensagem no banco
- [ ] Criar `ChatController` com método `send()`
- [ ] Implementar autorização (apenas mensagens do próprio usuário)
- [ ] Registrar rota `POST /api/v1/chat` em `routes.ts`

### **Phase 3: Additional Features** (Recursos adicionais)

- [ ] Criar endpoint `GET /api/v1/chat/history` para histórico
- [ ] Criar endpoint `GET /api/v1/chat/conversations` para listar conversas
- [ ] Implementar paginação para histórico
- [ ] Adicionar cache Redis para conversas recentes
- [ ] Implementar rate limiting (máx 10 queries/minuto por usuário)

### **Phase 4: Polish** (Refinamento)

- [ ] Adicionar tratamento de erros robusto
- [ ] Implementar logging de queries processadas
- [ ] Adicionar validação de tamanho máximo de query (500 chars)
- [ ] Implementar sanitização de input
- [ ] Adicionar métricas de performance (processing time)
- [ ] Criar testes unitários para ChatService
- [ ] Criar testes funcionais para endpoints

---

## 4. **File Changes**

### **New Files**

```
backend/database/migrations/YYYY_MM_DD_HHMMSS_create_chat_messages_table.ts
backend/app/enums/chat_message_type_enum.ts
backend/app/enums/chat_message_status_enum.ts
backend/app/models/chat_message.ts
backend/app/validators/send_chat_message_schema.ts
backend/app/validators/get_chat_history_schema.ts
backend/app/services/ChatService.ts
backend/app/controllers/chat_controller.ts
backend/tests/unit/services/chat_service.spec.ts
backend/tests/functional/chat.spec.ts
```

### **Modified Files**

```
backend/start/routes.ts
  → Adicionar grupo de rotas para /chat

backend/app/models/user.ts
  → Adicionar relacionamento hasMany para ChatMessage

backend/config/redis.ts
  → (se necessário) Ajustar configuração de cache
```

---

## 5. **Dependencies**

### **Packages já disponíveis**
```bash
# Já instalados no projeto:
- @adonisjs/lucid (ORM)
- @vinejs/vine (Validação)
- @adonisjs/auth (Autenticação)
- @adonisjs/redis (Cache)
- luxon (Datas)
```

### **Novos packages (opcional)**
```bash
# Para geração de UUIDs (se não usar crypto nativo do Node)
npm install uuid
npm install -D @types/uuid

# Para rate limiting (opcional)
npm install @adonisjs/limiter
```

### **Environment Variables**
```bash
# Já existentes no .env:
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# Novas variáveis (opcional):
CHAT_MAX_QUERY_LENGTH=500
CHAT_RATE_LIMIT_PER_MINUTE=10
CHAT_CACHE_TTL_SECONDS=3600
```

---

## 6. **Testing Strategy**

### **Unit Tests** (`tests/unit/services/chat_service.spec.ts`)
```typescript
- ChatService.processQuery() retorna resposta válida
- ChatService.processQuery() sanitiza input corretamente
- ChatService.generateConversationId() gera UUID válido
- ChatService.saveMessage() salva no banco corretamente
```

### **Functional Tests** (`tests/functional/chat.spec.ts`)
```typescript
- POST /api/v1/chat retorna 401 sem autenticação
- POST /api/v1/chat com payload válido retorna 201
- POST /api/v1/chat com query vazia retorna 400
- POST /api/v1/chat salva mensagem no banco
- GET /api/v1/chat/history retorna histórico do usuário
- GET /api/v1/chat/history não retorna mensagens de outros usuários
```

### **Integration Tests**
```typescript
- Testar cache Redis está funcionando
- Testar rate limiting bloqueia após limite
- Testar conversação multi-mensagem mantém conversationId
```

---

## 7. **Implementation Details**

### **7.1. Enum Definitions**

**`chat_message_type_enum.ts`**
```typescript
export enum ChatMessageTypeEnum {
	QUERY = 'query',
	COMMAND = 'command',
	ANALYSIS = 'analysis',
	SEARCH = 'search',
}
```

**`chat_message_status_enum.ts`**
```typescript
export enum ChatMessageStatusEnum {
	PENDING = 'pending',
	PROCESSING = 'processing',
	COMPLETED = 'completed',
	FAILED = 'failed',
}
```

### **7.2. Model Definition**

**`chat_message.ts`**
```typescript
import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import User from '#models/user'
import { ChatMessageTypeEnum } from '#enums/chat_message_type_enum'
import { ChatMessageStatusEnum } from '#enums/chat_message_status_enum'

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
```

### **7.3. Validator Schema**

**`send_chat_message_schema.ts`**
```typescript
import vine from '@vinejs/vine'
import { ChatMessageTypeEnum } from '#enums/chat_message_type_enum'

export const SendChatMessageSchema = vine.object({
	query: vine.string().trim().minLength(1).maxLength(500),
	context: vine.string().trim().optional(),
	conversationId: vine.string().uuid({ version: [4] }).optional(),
	metadata: vine.object({}).optional(),
})
```

### **7.4. Service Implementation**

**`ChatService.ts`**
```typescript
import { randomUUID } from 'node:crypto'
import ChatMessage from '#models/chat_message'
import { ChatMessageTypeEnum } from '#enums/chat_message_type_enum'
import { ChatMessageStatusEnum } from '#enums/chat_message_status_enum'

export class ChatService {
	/**
	 * Processa uma query de chat e retorna resposta
	 */
	static async processQuery(payload: {
		userId: number
		query: string
		conversationId?: string
		context?: string
		metadata?: Record<string, any>
	}): Promise<ChatMessage> {
		const startTime = Date.now()

		// Gera conversationId se não existir
		const conversationId = payload.conversationId || randomUUID()

		// Cria mensagem com status pending
		const message = await ChatMessage.create({
			userId: payload.userId,
			conversationId,
			query: payload.query,
			type: ChatMessageTypeEnum.QUERY,
			status: ChatMessageStatusEnum.PENDING,
			metadata: payload.metadata || null,
		})

		try {
			// Atualiza status para processing
			message.status = ChatMessageStatusEnum.PROCESSING
			await message.save()

			// TODO: Implementar lógica de processamento real
			// Por enquanto, resposta mockada
			const response = await this.generateResponse(payload.query, payload.context)

			// Calcula tempo de processamento
			const processingTime = Date.now() - startTime

			// Atualiza mensagem com resposta
			message.response = response
			message.status = ChatMessageStatusEnum.COMPLETED
			message.processingTimeMs = processingTime
			await message.save()

			return message
		} catch (error) {
			// Em caso de erro, marca como failed
			message.status = ChatMessageStatusEnum.FAILED
			message.response = 'Erro ao processar sua mensagem. Tente novamente.'
			await message.save()
			throw error
		}
	}

	/**
	 * Gera resposta para a query (mockado por enquanto)
	 */
	private static async generateResponse(query: string, context?: string): Promise<string> {
		// TODO: Implementar lógica real de processamento
		// Pode integrar com AI, buscar dados, executar comandos, etc.

		return `Recebi sua mensagem: "${query}". Esta é uma resposta mockada. A funcionalidade completa será implementada em breve.`
	}

	/**
	 * Busca histórico de mensagens de um usuário
	 */
	static async getHistory(payload: {
		userId: number
		conversationId?: string
		limit?: number
		offset?: number
	}): Promise<{ messages: ChatMessage[]; total: number }> {
		const query = ChatMessage.query().where('user_id', payload.userId)

		if (payload.conversationId) {
			query.where('conversation_id', payload.conversationId)
		}

		// Conta total
		const total = await query.clone().count('* as total').first()

		// Busca mensagens com paginação
		const messages = await query
			.orderBy('created_at', 'desc')
			.limit(payload.limit || 50)
			.offset(payload.offset || 0)

		return {
			messages,
			total: Number(total?.$extras.total || 0),
		}
	}

	/**
	 * Lista todas as conversas de um usuário
	 */
	static async listConversations(userId: number): Promise<
		Array<{
			conversationId: string
			messageCount: number
			lastMessage: string
			lastMessageAt: string
		}>
	> {
		const conversations = await ChatMessage.query()
			.where('user_id', userId)
			.select('conversation_id')
			.groupBy('conversation_id')
			.orderBy('created_at', 'desc')

		// Para cada conversa, busca última mensagem
		const result = await Promise.all(
			conversations.map(async (conv) => {
				const lastMessage = await ChatMessage.query()
					.where('conversation_id', conv.conversationId)
					.orderBy('created_at', 'desc')
					.first()

				const count = await ChatMessage.query()
					.where('conversation_id', conv.conversationId)
					.count('* as total')
					.first()

				return {
					conversationId: conv.conversationId,
					messageCount: Number(count?.$extras.total || 0),
					lastMessage: lastMessage?.query || '',
					lastMessageAt: lastMessage?.createdAt.toISO() || '',
				}
			})
		)

		return result
	}
}
```

### **7.5. Controller Implementation**

**`chat_controller.ts`**
```typescript
import type { HttpContext } from '@adonisjs/core/http'
import vine from '@vinejs/vine'
import { ChatService } from '#services/ChatService'
import { SendChatMessageSchema } from '#validators/send_chat_message_schema'

export default class ChatController {
	/**
	 * POST /api/v1/chat
	 * Envia uma mensagem/query para o chat
	 */
	public async send({ auth, request, response }: HttpContext) {
		const userId = auth.user!.id
		const data = request.all()

		// Valida payload
		const payload = await vine.validate({
			schema: SendChatMessageSchema,
			data,
		})

		// Processa query
		const message = await ChatService.processQuery({
			userId,
			...payload,
		})

		return response.status(201).json({
			status: 201,
			message: 'Message processed successfully',
			chatMessage: message,
		})
	}

	/**
	 * GET /api/v1/chat/history
	 * Retorna histórico de mensagens do usuário
	 */
	public async history({ auth, request, response }: HttpContext) {
		const userId = auth.user!.id
		const conversationId = request.input('conversationId')
		const limit = request.input('limit', 50)
		const offset = request.input('offset', 0)

		const { messages, total } = await ChatService.getHistory({
			userId,
			conversationId,
			limit: Math.min(limit, 100), // máximo 100
			offset,
		})

		return response.status(200).json({
			status: 200,
			messages,
			pagination: {
				total,
				limit,
				offset,
				hasMore: offset + limit < total,
			},
		})
	}

	/**
	 * GET /api/v1/chat/conversations
	 * Lista todas as conversas do usuário
	 */
	public async conversations({ auth, response }: HttpContext) {
		const userId = auth.user!.id

		const conversations = await ChatService.listConversations(userId)

		return response.status(200).json({
			status: 200,
			conversations,
		})
	}
}
```

### **7.6. Routes Registration**

**`start/routes.ts`** (adicionar ao grupo autenticado)
```typescript
// Importar controller
const ChatController = () => import('#controllers/chat_controller')

// Dentro do router.group(() => {...}).use(middleware.auth())
router
	.group(() => {
		router.post('/', [ChatController, 'send'])
		router.get('/history', [ChatController, 'history'])
		router.get('/conversations', [ChatController, 'conversations'])
	})
	.prefix('/v1/chat')
```

### **7.7. Migration**

**`database/migrations/XXXX_create_chat_messages_table.ts`**
```typescript
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
	protected tableName = 'chat_messages'

	async up() {
		this.schema.createTable(this.tableName, (table) => {
			table.increments('id').primary()
			table
				.integer('user_id')
				.unsigned()
				.notNullable()
				.references('id')
				.inTable('users')
				.onDelete('CASCADE')
			table.uuid('conversation_id').notNullable()
			table.text('query').notNullable()
			table.text('response').nullable()
			table.string('type', 50).notNullable().defaultTo('query')
			table.string('status', 50).notNullable().defaultTo('pending')
			table.jsonb('metadata').nullable()
			table.integer('processing_time_ms').nullable()
			table.timestamp('created_at').notNullable().defaultTo(this.now())
			table.timestamp('updated_at').notNullable().defaultTo(this.now())

			// Indexes
			table.index('user_id', 'idx_chat_messages_user_id')
			table.index('conversation_id', 'idx_chat_messages_conversation_id')
			table.index('created_at', 'idx_chat_messages_created_at')
		})
	}

	async down() {
		this.schema.dropTable(this.tableName)
	}
}
```

---

## 8. **Risk Assessment**

### **Technical Risks**
- **Alto**: Implementação da lógica de processamento de queries (AI/NLP)
  - Mitigação: Começar com respostas mockadas, implementar gradualmente
- **Médio**: Performance com histórico grande (milhares de mensagens)
  - Mitigação: Paginação eficiente, índices no banco, cache Redis
- **Baixo**: UUID collision
  - Mitigação: UUID v4 tem probabilidade negligenciável de colisão

### **Dependency Risks**
- **Baixo**: Todas as dependências principais já estão no projeto
- **Médio**: Integração futura com serviços de AI (se necessário)
  - Mitigação: Arquitetura modular permite trocar implementação

### **Data Risks**
- **Médio**: Crescimento rápido da tabela chat_messages
  - Mitigação: Implementar política de retenção (ex: manter 90 dias)
- **Baixo**: Dados sensíveis em queries
  - Mitigação: Nunca logar queries completas, sanitizar dados

---

## 9. **Security Considerations**

### **Input Validation**
- ✅ Validação de tamanho máximo (500 chars)
- ✅ Sanitização de input no validator
- ✅ Validação de tipo UUID para conversationId
- ✅ Rate limiting (10 queries/minuto)

### **Authorization**
- ✅ Autenticação obrigatória via Bearer token
- ✅ Usuário só acessa suas próprias mensagens
- ✅ Queries são filtradas por userId no banco

### **Data Protection**
- ✅ Não logar queries completas (podem conter dados sensíveis)
- ✅ Metadata opcional (controlado pelo cliente)
- ✅ Resposta não expõe dados de outros usuários

---

## 10. **Success Criteria**

### ✅ **Funcional**
- [ ] Endpoint POST /api/v1/chat recebe e processa queries
- [ ] Endpoint GET /api/v1/chat/history retorna histórico paginado
- [ ] Endpoint GET /api/v1/chat/conversations lista conversas
- [ ] Apenas usuários autenticados podem acessar
- [ ] Usuário só vê suas próprias mensagens

### ✅ **Performance**
- [ ] Resposta em < 500ms (sem processamento complexo)
- [ ] Cache Redis funciona corretamente
- [ ] Queries de histórico otimizadas com índices

### ✅ **Quality**
- [ ] Testes unitários passam (> 80% coverage)
- [ ] Testes funcionais passam (todos os endpoints)
- [ ] Sem erros no console do backend
- [ ] Biome check passa sem warnings

### ✅ **Security**
- [ ] Rate limiting ativo
- [ ] Input validation funciona
- [ ] Autorização por userId implementada
- [ ] Sem SQL injection vulnerabilities

---

## 11. **Next Steps**

### **Immediate Actions** (Para começar agora)
1. ✅ Revisar este plano com o time/stakeholder
2. ⬜ Criar branch `feature/chat-endpoint`
3. ⬜ Executar migration para criar tabela
4. ⬜ Implementar Phase 1 (Foundation)

### **Development Flow**
1. **Setup** → Criar enums, model, validator
2. **Service** → Implementar ChatService com lógica mockada
3. **Controller** → Criar endpoints básicos
4. **Routes** → Registrar rotas
5. **Test** → Testar via Postman/Insomnia
6. **Iterate** → Adicionar features adicionais
7. **Deploy** → Merge para main após aprovação

### **Future Enhancements** (Pós-MVP)
- Integração com AI/LLM (OpenAI, Claude, etc.)
- Busca semântica em histórico
- Streaming de respostas (SSE)
- Suporte a anexos (imagens, arquivos)
- Notificações em tempo real (WebSocket)
- Analytics de uso do chat

---

## 12. **API Usage Example**

### **Enviar primeira mensagem**
```bash
curl -X POST http://localhost:3333/api/v1/chat \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "Como está o progresso do atleta João Silva?"
  }'
```

### **Continuar conversa**
```bash
curl -X POST http://localhost:3333/api/v1/chat \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "E qual o próximo exercício recomendado?",
    "conversationId": "uuid-retornado-na-primeira-mensagem"
  }'
```

### **Ver histórico**
```bash
curl -X GET "http://localhost:3333/api/v1/chat/history?limit=20&offset=0" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### **Listar conversas**
```bash
curl -X GET http://localhost:3333/api/v1/chat/conversations \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 13. **Notes**

### **Observação sobre a porta**
Você mencionou `localhost:8000`, mas segundo a documentação do projeto (CLAUDE.md) e a configuração padrão do AdonisJS, o backend roda na **porta 3333**. Verifique se:
- Você tem um proxy configurado
- Ou precisa ajustar para usar a porta correta (3333)
- Ou se há outra aplicação na porta 8000

### **Code Style Reminder**
Lembre-se de seguir os padrões do projeto:
- ✅ **Tabs** para indentação (não spaces)
- ✅ **Single quotes** para strings
- ✅ **Sem semicolons** no final das linhas
- ✅ Usar path aliases (`#controllers`, `#services`, etc.)
- ✅ Rodar `npm run lint:fix` antes de commit

---

**Este plano fornece uma implementação completa, segura e escalável do endpoint de chat seguindo todos os padrões do projeto.**
