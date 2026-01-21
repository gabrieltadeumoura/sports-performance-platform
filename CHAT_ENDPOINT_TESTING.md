# Testing Chat Endpoint

## Prerequisites

1. **Backend AdonisJS** deve estar rodando na porta 3333
```bash
cd backend
npm run dev
```

2. **API Python** deve estar rodando na porta 8000
```bash
# Certifique-se que sua API Python está ativa em localhost:8000
```

3. **PostgreSQL e Redis** devem estar rodando
```bash
cd backend
docker compose up -d
```

4. **Variáveis de ambiente** configuradas em `backend/.env`
```bash
CHAT_API_URL=http://localhost:8000/api/v1/chat
CHAT_API_TIMEOUT=30000
```

---

## Endpoints Disponíveis

### 1. POST /api/v1/chat
Envia uma mensagem para o chat (que será processada pela API Python)

**URL:** `http://localhost:3333/api/v1/chat`

**Método:** POST

**Headers:**
```
Authorization: Bearer YOUR_ACCESS_TOKEN
Content-Type: application/json
```

**Body:**
```json
{
  "query": "Como está o progresso do atleta João Silva?",
  "context": "dashboard",
  "conversationId": "optional-uuid-v4",
  "metadata": {
    "athleteId": 123,
    "source": "dashboard"
  }
}
```

**Response (201):**
```json
{
  "status": 201,
  "message": "Message processed successfully",
  "chatMessage": {
    "id": 1,
    "userId": 5,
    "conversationId": "uuid-v4",
    "query": "Como está o progresso do atleta João Silva?",
    "response": "Resposta da API Python...",
    "type": "query",
    "status": "completed",
    "metadata": {
      "athleteId": 123,
      "source": "dashboard"
    },
    "processingTimeMs": 250,
    "createdAt": "2024-01-20T10:00:00.000Z",
    "updatedAt": "2024-01-20T10:00:00.000Z"
  }
}
```

---

### 2. GET /api/v1/chat/history
Retorna histórico de mensagens do usuário

**URL:** `http://localhost:3333/api/v1/chat/history`

**Método:** GET

**Headers:**
```
Authorization: Bearer YOUR_ACCESS_TOKEN
```

**Query Parameters:**
- `conversationId` (opcional): UUID da conversa específica
- `limit` (opcional, default: 50, max: 100): Número de mensagens
- `offset` (opcional, default: 0): Offset para paginação

**Example:**
```
GET /api/v1/chat/history?limit=20&offset=0
```

**Response (200):**
```json
{
  "status": 200,
  "messages": [
    {
      "id": 1,
      "userId": 5,
      "conversationId": "uuid",
      "query": "pergunta",
      "response": "resposta",
      "type": "query",
      "status": "completed",
      "metadata": null,
      "processingTimeMs": 250,
      "createdAt": "2024-01-20T10:00:00.000Z",
      "updatedAt": "2024-01-20T10:00:00.000Z"
    }
  ],
  "pagination": {
    "total": 45,
    "limit": 20,
    "offset": 0,
    "hasMore": true
  }
}
```

---

### 3. GET /api/v1/chat/conversations
Lista todas as conversas do usuário

**URL:** `http://localhost:3333/api/v1/chat/conversations`

**Método:** GET

**Headers:**
```
Authorization: Bearer YOUR_ACCESS_TOKEN
```

**Response (200):**
```json
{
  "status": 200,
  "conversations": [
    {
      "conversationId": "uuid-1",
      "messageCount": 5,
      "lastMessage": "Como está o progresso?",
      "lastMessageAt": "2024-01-20T10:00:00.000Z"
    },
    {
      "conversationId": "uuid-2",
      "messageCount": 3,
      "lastMessage": "Qual é o próximo exercício?",
      "lastMessageAt": "2024-01-19T15:30:00.000Z"
    }
  ]
}
```

---

## Testing with cURL

### Step 1: Login to get access token
```bash
curl -X POST http://localhost:3333/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "your-email@example.com",
    "password": "your-password"
  }'
```

**Copy the `token` from the response.**

### Step 2: Send chat message
```bash
curl -X POST http://localhost:3333/api/v1/chat \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "Como está o progresso do atleta João Silva?"
  }'
```

### Step 3: Get chat history
```bash
curl -X GET "http://localhost:3333/api/v1/chat/history?limit=10" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Step 4: List conversations
```bash
curl -X GET http://localhost:3333/api/v1/chat/conversations \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## Testing with Postman/Insomnia

### 1. Create Environment Variables
- `BASE_URL`: `http://localhost:3333`
- `TOKEN`: Your access token (get from login)

### 2. Import Collection

**POST Login:**
```
URL: {{BASE_URL}}/login
Method: POST
Body (JSON):
{
  "email": "your-email@example.com",
  "password": "your-password"
}
```

**POST Send Chat Message:**
```
URL: {{BASE_URL}}/api/v1/chat
Method: POST
Headers:
  Authorization: Bearer {{TOKEN}}
  Content-Type: application/json
Body (JSON):
{
  "query": "Como está o progresso do atleta João Silva?",
  "context": "dashboard"
}
```

**GET Chat History:**
```
URL: {{BASE_URL}}/api/v1/chat/history?limit=20
Method: GET
Headers:
  Authorization: Bearer {{TOKEN}}
```

**GET Conversations:**
```
URL: {{BASE_URL}}/api/v1/chat/conversations
Method: GET
Headers:
  Authorization: Bearer {{TOKEN}}
```

---

## Error Scenarios

### 1. API Python não está rodando
**Request:**
```bash
curl -X POST http://localhost:3333/api/v1/chat \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"query": "test"}'
```

**Response (500):**
```json
{
  "status": 500,
  "message": "Erro ao processar mensagem. Tente novamente.",
  "error": "Erro ao chamar API Python: fetch failed"
}
```

### 2. Sem autenticação
**Request:**
```bash
curl -X POST http://localhost:3333/api/v1/chat \
  -H "Content-Type: application/json" \
  -d '{"query": "test"}'
```

**Response (401):**
```json
{
  "errors": [
    {
      "message": "Unauthorized access"
    }
  ]
}
```

### 3. Query inválida (vazia ou muito longa)
**Request:**
```bash
curl -X POST http://localhost:3333/api/v1/chat \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"query": ""}'
```

**Response (400):**
```json
{
  "errors": [
    {
      "field": "query",
      "message": "The query field must have at least 1 characters",
      "rule": "minLength"
    }
  ]
}
```

---

## Database Verification

### Check if message was saved
```sql
-- Connect to PostgreSQL
psql -U root -d app

-- Query chat messages
SELECT
  id,
  user_id,
  conversation_id,
  query,
  LEFT(response, 50) as response_preview,
  status,
  processing_time_ms,
  created_at
FROM chat_messages
ORDER BY created_at DESC
LIMIT 10;
```

---

## Integration with Python API

### Expected Python API Format

Your Python API should accept POST requests to `/api/v1/chat`:

**Request from AdonisJS:**
```json
{
  "query": "Como está o progresso do atleta João Silva?",
  "context": "dashboard",
  "conversation_id": "uuid-v4",
  "metadata": {
    "athleteId": 123
  }
}
```

**Expected Response:**
```json
{
  "response": "O atleta João Silva está progredindo bem. Ele completou 80% dos exercícios prescritos...",
  "confidence": 0.95,
  "sources": ["treatment_plan_123", "exercise_session_456"]
}
```

**Alternative formats supported:**
```json
{
  "message": "Response text here..."
}
```

ou qualquer JSON (será convertido para string se não tiver `response` ou `message`)

---

## Troubleshooting

### Backend não inicia
```bash
# Check if PostgreSQL is running
docker ps

# Check environment variables
cat backend/.env | grep CHAT

# Check migration status
cd backend
node ace migration:status
```

### API Python não responde
```bash
# Test Python API directly
curl -X POST http://localhost:8000/api/v1/chat \
  -H "Content-Type: application/json" \
  -d '{"query": "test"}'
```

### Timeout errors
Increase timeout in `.env`:
```
CHAT_API_TIMEOUT=60000  # 60 seconds
```

---

## Next Steps

1. ✅ Test all endpoints with valid data
2. ✅ Test error scenarios
3. ✅ Verify database persistence
4. ✅ Test with your actual Python API
5. ⬜ Add rate limiting (opcional)
6. ⬜ Add caching for recent conversations (opcional)
7. ⬜ Implement frontend integration
