# Plano de Implementação Completa - Sports Performance Platform

## 📋 Análise do Backend

### Models e Relacionamentos

#### **Core Models**
1. **User** - Usuários do sistema
2. **Athlete** - Atletas (pertence a User)
   - Relacionamentos: `hasMany` InjuryRecord, TreatmentPlan, Appointment, etc.

#### **Gestão de Lesões e Tratamentos**
3. **InjuryRecord** - Registros de lesões
   - Campos: athleteId, injuryType, bodyPart, severity, cause, expectedRecovery, actualRecovery, treatmentProtocol, status, injuryDate, recoveryDate
   - Relacionamentos: `belongsTo` Athlete

4. **TreatmentPlan** - Planos de tratamento
   - Campos: athleteId, userId, injuryRecordId (opcional), diagnosis, objectives, notes, startDate, endDate, status
   - Relacionamentos: `belongsTo` Athlete, User, InjuryRecord
   - Status: draft, active, paused, completed, cancelled

5. **TreatmentSession** - Sessões de tratamento
   - Campos: treatmentPlanId, athleteId, userId, sessionDate, type (in_person/remote), techniquesApplied, observations, nextSteps, nextSessionDate, status
   - Relacionamentos: `belongsTo` TreatmentPlan, Athlete, User

6. **PrescribedExercise** - Exercícios prescritos
   - Campos: treatmentPlanId, exerciseId, sets, repetitions, durationSeconds, restSeconds, frequency, displayOrder, instructions, notes, isActive
   - Relacionamentos: `belongsTo` TreatmentPlan, Exercise

7. **ExerciseSession** - Sessões de exercícios
   - Campos: prescribedExerciseId, athleteId, sessionDate, completed, notes, painLevel, difficulty
   - Relacionamentos: `belongsTo` PrescribedExercise, Athlete

#### **Avaliações e Testes**
8. **PhysicalAssessment** - Avaliações físicas (Testes Físicos)
   - Campos: athleteId, userId, assessmentDate, type, rangeOfMotion, muscleStrength, functionalTests, posturalAssessment, weight, height, bodyFatPercentage, observations, limitations, recommendations, attachments
   - Relacionamentos: `belongsTo` Athlete, User

#### **Exercícios**
9. **Exercise** - Catálogo de exercícios
   - Campos: name, description, instructions, category, bodyRegion, difficulty, estimatedDurationMinutes, equipmentNeeded, contraindications, isActive
   - Categorias: strength, flexibility, cardio, balance, etc.

10. **ExerciseMedia** - Mídias dos exercícios
    - Campos: exerciseId, mediaType, url, displayOrder
    - Relacionamentos: `belongsTo` Exercise

#### **Evolução e Monitoramento**
11. **PatientEvolution** - Evolução do paciente
    - Campos: athleteId, userId, treatmentPlanId, evolutionDate, type, metrics, painLevel, rangeOfMotion, strengthLevel, observations, attachments
    - Relacionamentos: `belongsTo` Athlete, User, TreatmentPlan

12. **Medication** - Medicamentos
    - Campos: athleteId, name, dosage, frequency, instructions, prescribedBy, startDate, endDate, isActive, notes
    - Relacionamentos: `belongsTo` Athlete

#### **Agendamentos e Questionários**
13. **Appointment** - Agendamentos
    - Campos: athleteId, userId, treatmentPlanId, appointmentDate, durationMinutes, type, status, notes, reason, observations, reminderSent
    - Tipos: consultation, treatment, follow_up, assessment, review
    - Status: scheduled, confirmed, in_progress, completed, cancelled, no_show, rescheduled
    - Relacionamentos: `belongsTo` Athlete, User, TreatmentPlan

14. **Questionnaire** - Questionários
    - Campos: name, description, type, isActive
    - Tipos: initial_assessment, follow_up, pain_assessment, functional_assessment, medication_review, general

15. **QuestionnaireQuestion** - Perguntas do questionário
    - Campos: questionnaireId, questionText, questionType, options, displayOrder, isRequired
    - Tipos: text, number, boolean, single_choice, multiple_choice, scale, date

16. **QuestionnaireResponse** - Respostas aos questionários
    - Campos: questionnaireId, athleteId, treatmentPlanId, responses, completedAt
    - Relacionamentos: `belongsTo` Questionnaire, Athlete, TreatmentPlan

#### **Relatórios**
17. **Report** - Relatórios
    - Campos: athleteId, treatmentPlanId, type, title, content, generatedAt
    - Tipos: progress, assessment, discharge
    - Relacionamentos: `belongsTo` Athlete, TreatmentPlan

---

## 🎯 Estrutura de Features Proposta

### Organização por Domínio

```
frontend/src/features/
├── auth/                    ✅ (já existe)
│   ├── api.ts
│   ├── hooks.ts
│   ├── AuthProvider.tsx
│   └── schemas.ts
│
├── athletes/               ✅ (já existe - precisa completar)
│   ├── api.ts
│   ├── hooks.ts
│   ├── schemas.ts
│   └── components/
│       └── AthleteForm.tsx
│
├── injury-records/         ⚠️ (parcial - precisa CRUD completo)
│   ├── api.ts              ✅
│   ├── hooks.ts            ✅
│   ├── schemas.ts          ❌ (criar)
│   └── components/
│       ├── InjuryRecordForm.tsx      ❌
│       ├── InjuryRecordTable.tsx     ❌
│       └── InjuryRecordFilters.tsx   ❌
│
├── treatment-plans/        ❌ (criar - substituir physical-tests)
│   ├── api.ts
│   ├── hooks.ts
│   ├── schemas.ts
│   └── components/
│       ├── TreatmentPlanForm.tsx
│       ├── TreatmentPlanCard.tsx
│       ├── TreatmentPlanDetail.tsx
│       └── TreatmentPlanStatusBadge.tsx
│
├── treatment-sessions/     ❌ (criar)
│   ├── api.ts
│   ├── hooks.ts
│   ├── schemas.ts
│   └── components/
│       └── TreatmentSessionForm.tsx
│
├── physical-assessments/   ⚠️ (renomear de physical-tests)
│   ├── api.ts              ✅
│   ├── hooks.ts            ✅
│   ├── schemas.ts          ❌
│   └── components/
│       └── PhysicalAssessmentForm.tsx  ❌
│
├── exercises/              ❌ (criar)
│   ├── api.ts
│   ├── hooks.ts
│   ├── schemas.ts
│   └── components/
│       ├── ExerciseCard.tsx
│       ├── ExerciseForm.tsx
│       └── ExerciseFilters.tsx
│
├── prescribed-exercises/  ❌ (criar)
│   ├── api.ts
│   ├── hooks.ts
│   ├── schemas.ts
│   └── components/
│       └── PrescribedExerciseForm.tsx
│
├── exercise-sessions/     ❌ (criar)
│   ├── api.ts
│   ├── hooks.ts
│   └── schemas.ts
│
├── patient-evolutions/   ❌ (criar)
│   ├── api.ts
│   ├── hooks.ts
│   ├── schemas.ts
│   └── components/
│       └── PatientEvolutionForm.tsx
│
├── medications/          ❌ (criar)
│   ├── api.ts
│   ├── hooks.ts
│   ├── schemas.ts
│   └── components/
│       └── MedicationForm.tsx
│
├── appointments/         ❌ (criar)
│   ├── api.ts
│   ├── hooks.ts
│   ├── schemas.ts
│   └── components/
│       ├── AppointmentForm.tsx
│       ├── AppointmentCalendar.tsx
│       └── AppointmentCard.tsx
│
├── questionnaires/       ❌ (criar)
│   ├── api.ts
│   ├── hooks.ts
│   ├── schemas.ts
│   └── components/
│       ├── QuestionnaireBuilder.tsx
│       ├── QuestionnaireForm.tsx
│       └── QuestionnaireResponseForm.tsx
│
├── reports/              ❌ (criar)
│   ├── api.ts
│   ├── hooks.ts
│   └── components/
│       └── ReportViewer.tsx
│
└── dashboard/            ✅ (já existe)
    └── hooks.ts
```

---

## 🚀 Plano de Implementação por Fases

### **FASE 1: Correções e Reorganização (PRIORIDADE ALTA)**

#### 1.1 Backend - Endpoints Faltantes
- [ ] Criar `GET /api/injury-records` (listar todos os registros do usuário)
- [ ] Criar `GET /api/physical-assessments` (listar todos os assessments do usuário)

#### 1.2 Frontend - Reorganização de Navegação
- [ ] Inverter ordem: "Lesões" antes de "Tratamentos"
- [ ] Renomear "Testes físicos" para "Tratamentos" no menu
- [ ] Atualizar rotas: `/physical-tests` → `/treatments`
- [ ] Atualizar `DashboardLayout.tsx`

#### 1.3 Frontend - CRUD Completo de Lesões
- [ ] Criar schema de validação (`injury-records/schemas.ts`)
- [ ] Criar componente `InjuryRecordForm.tsx` com todos os campos
- [ ] Implementar Create, Read, Update, Delete
- [ ] Adicionar filtros e busca
- [ ] Melhorar tabela com todos os campos relevantes

#### 1.4 Frontend - CRUD Completo de Tratamentos (Treatment Plans)
- [ ] Criar feature `treatment-plans/`
- [ ] Implementar API client completo
- [ ] Criar hooks React Query
- [ ] Criar schemas de validação
- [ ] Criar componentes de formulário e listagem
- [ ] Implementar ações: activate, pause, complete
- [ ] Criar página `TreatmentsPage.tsx`

---

### **FASE 2: Funcionalidades Core (PRIORIDADE ALTA)**

#### 2.1 Detalhes do Atleta - Expansão
- [ ] Adicionar aba "Lesões" no `AthleteDetailPage`
- [ ] Adicionar aba "Tratamentos" no `AthleteDetailPage`
- [ ] Adicionar aba "Avaliações Físicas" no `AthleteDetailPage`
- [ ] Adicionar aba "Evolução" no `AthleteDetailPage`
- [ ] Adicionar aba "Medicamentos" no `AthleteDetailPage`
- [ ] Adicionar aba "Agendamentos" no `AthleteDetailPage`

#### 2.2 Tratamentos - Funcionalidades Relacionadas
- [ ] Implementar `treatment-sessions/` (sessões de tratamento)
- [ ] Implementar `prescribed-exercises/` (exercícios prescritos)
- [ ] Implementar `exercise-sessions/` (sessões de exercícios)
- [ ] Criar view detalhada de tratamento com timeline

#### 2.3 Exercícios
- [ ] Implementar `exercises/` (catálogo de exercícios)
- [ ] Criar página de busca/filtro de exercícios
- [ ] Implementar visualização de mídias dos exercícios

---

### **FASE 3: Funcionalidades Avançadas (PRIORIDADE MÉDIA)**

#### 3.1 Questionários
- [ ] Implementar `questionnaires/` (criação de questionários)
- [ ] Implementar `questionnaire-questions/` (builder de perguntas)
- [ ] Implementar `questionnaire-responses/` (respostas)
- [ ] Criar interface de resposta dinâmica

#### 3.2 Agendamentos
- [ ] Implementar `appointments/`
- [ ] Criar calendário de agendamentos
- [ ] Implementar lembretes e notificações
- [ ] Criar view de agenda do profissional

#### 3.3 Evolução do Paciente
- [ ] Implementar `patient-evolutions/`
- [ ] Criar gráficos de evolução
- [ ] Implementar upload de anexos

#### 3.4 Medicamentos
- [ ] Implementar `medications/`
- [ ] Criar gestão de medicamentos ativos/inativos
- [ ] Adicionar alertas de vencimento

---

### **FASE 4: Relatórios e Analytics (PRIORIDADE BAIXA)**

#### 4.1 Relatórios
- [ ] Implementar `reports/`
- [ ] Criar geração de relatórios de progresso
- [ ] Criar geração de relatórios de avaliação
- [ ] Implementar visualização de relatórios

#### 4.2 Dashboard Avançado
- [ ] Expandir métricas do dashboard
- [ ] Adicionar gráficos de tendências
- [ ] Criar filtros por período

---

## 📐 Arquitetura de Componentes

### Padrão de Feature Module

Cada feature deve seguir este padrão:

```typescript
// features/{feature-name}/
├── api.ts              // Funções de API client
├── hooks.ts            // React Query hooks
├── schemas.ts          // Validação (Zod ou similar)
├── types.ts            // TypeScript types (se necessário)
└── components/         // Componentes específicos da feature
    ├── {Feature}Form.tsx
    ├── {Feature}List.tsx
    ├── {Feature}Card.tsx
    └── {Feature}Detail.tsx
```

### Exemplo: Injury Records

```typescript
// features/injury-records/api.ts
export type InjuryRecord = { ... }
export type CreateInjuryRecordPayload = { ... }
export type UpdateInjuryRecordPayload = { ... }

export function getInjuryRecords() { ... }
export function getInjuryRecordById(id: number) { ... }
export function createInjuryRecord(payload: CreateInjuryRecordPayload) { ... }
export function updateInjuryRecord(id: number, payload: UpdateInjuryRecordPayload) { ... }
export function deleteInjuryRecord(id: number) { ... }

// features/injury-records/hooks.ts
export function useInjuryRecords() { ... }
export function useInjuryRecord(id: number) { ... }
export function useCreateInjuryRecord() { ... }
export function useUpdateInjuryRecord() { ... }
export function useDeleteInjuryRecord() { ... }

// features/injury-records/schemas.ts
export const createInjuryRecordSchema = z.object({ ... })
export const updateInjuryRecordSchema = z.object({ ... })
```

---

## 🎨 Estrutura de Páginas

### Rotas Principais

```
/dashboard                    ✅ DashboardPage
/athletes                     ✅ AthletesPage
/athletes/:id                  ✅ AthleteDetailPage
/injury-records               ⚠️ InjuryRecordsPage (precisa CRUD completo)
/treatments                   ❌ TreatmentsPage (criar - substituir physical-tests)
/physical-assessments         ❌ PhysicalAssessmentsPage (renomear de physical-tests)
/exercises                    ❌ ExercisesPage
/appointments                 ❌ AppointmentsPage
/questionnaires               ❌ QuestionnairesPage
/reports                      ❌ ReportsPage
```

### Páginas de Detalhe

```
/treatments/:id               ❌ TreatmentPlanDetailPage
/exercises/:id               ❌ ExerciseDetailPage
/appointments/:id            ❌ AppointmentDetailPage
```

---

## 🔧 Melhorias Técnicas Recomendadas

### 1. Gerenciamento de Estado
- ✅ React Query já implementado
- ⚠️ Considerar Zustand ou Context API para estado global (se necessário)

### 2. Validação de Formulários
- ❌ Implementar Zod para validação
- ❌ Integrar com React Hook Form

### 3. Componentes Reutilizáveis
- ✅ UI components básicos existem
- ❌ Criar componentes específicos de domínio:
  - `AthleteSelect` - Select de atletas
  - `DateRangePicker` - Seletor de período
  - `StatusBadge` - Badge de status
  - `EnumSelect` - Select para enums

### 4. Tratamento de Erros
- ⚠️ Padronizar tratamento de erros da API
- ❌ Criar componente de erro global
- ❌ Implementar toast notifications consistentes

### 5. Loading States
- ⚠️ Padronizar estados de loading
- ❌ Criar skeleton loaders

### 6. Filtros e Busca
- ❌ Criar componente genérico de filtros
- ❌ Implementar busca em todas as listagens

---

## 📝 Checklist de Implementação Imediata

### Prioridade 1 (Sua solicitação original)
- [ ] Inverter posições: Lesões antes de Tratamentos
- [ ] Renomear "Testes físicos" para "Tratamentos"
- [ ] Implementar CRUD completo de Lesões
- [ ] Implementar CRUD completo de Tratamentos

### Prioridade 2 (Backend necessário)
- [ ] Criar endpoint `GET /api/injury-records`
- [ ] Criar endpoint `GET /api/physical-assessments`

### Prioridade 3 (Melhorias)
- [ ] Criar schemas de validação para todas as features
- [ ] Padronizar componentes de formulário
- [ ] Implementar tratamento de erros consistente

---

## 🎯 Próximos Passos Sugeridos

1. **Começar pela FASE 1** - Corrigir endpoints faltantes no backend e implementar CRUD completo
2. **Expandir AthleteDetailPage** - Adicionar abas com informações relacionadas
3. **Criar componentes reutilizáveis** - AthleteSelect, StatusBadge, etc.
4. **Implementar features restantes** - Seguindo a ordem de prioridade

---

## 📊 Métricas de Sucesso

- ✅ Todas as models do backend têm correspondência no frontend
- ✅ Todos os endpoints estão consumidos
- ✅ CRUD completo para todas as entidades principais
- ✅ Interface consistente e intuitiva
- ✅ Validação de formulários em todos os lugares
- ✅ Tratamento de erros padronizado
- ✅ Performance otimizada (React Query cache)

---

**Este documento serve como guia completo para transformar sua aplicação em uma plataforma completa e profissional de gestão de performance esportiva.**
