const AthletesController = () => import('#controllers/athletes_controller')
const AuthController = () => import('#controllers/auth_controller')
const DashboardController = () => import('#controllers/dashboard_controller')
const InjuryRecordsController = () =>
	import('#controllers/injuryrecords_controller')
const UsersController = () => import('#controllers/users_controller')
const PhysicalAssessmentsController = () =>
	import('#controllers/physical_assessments_controller')
const ExercisesController = () => import('#controllers/exercises_controller')
const ExerciseMediaController = () =>
	import('#controllers/exercise_media_controller')
const TreatmentPlansController = () =>
	import('#controllers/treatment_plans_controller')
const PrescribedExercisesController = () =>
	import('#controllers/prescribed_exercises_controller')
const ExerciseSessionsController = () =>
	import('#controllers/exercise_sessions_controller')
const TreatmentSessionsController = () =>
	import('#controllers/treatment_sessions_controller')
const PatientEvolutionsController = () =>
	import('#controllers/patient_evolutions_controller')
const MedicationsController = () =>
	import('#controllers/medications_controller')
const QuestionnairesController = () =>
	import('#controllers/questionnaires_controller')
const QuestionnaireQuestionsController = () =>
	import('#controllers/questionnaire_questions_controller')
const QuestionnaireResponsesController = () =>
	import('#controllers/questionnaire_responses_controller')
const AppointmentsController = () =>
	import('#controllers/appointments_controller')
const ReportsController = () => import('#controllers/reports_controller')

import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'

router.post('/register', [UsersController, 'createUser'])
router.post('/login', [AuthController, 'login'])

router
	.group(() => {
		router
			.group(() => {
				router.get('/overview', [
					DashboardController,
					'getOverviewDashboardMetrics',
				])
				router.get('/trends', [DashboardController, 'getTrendingMetrics'])
				router.get('/alerts', [DashboardController, 'getCriticalAlerts'])
				router.get('/team-performance', [
					DashboardController,
					'getTeamPerformance',
				])
			})
			.prefix('/dashboard')

		router
			.group(() => {
				router.post('/', [AthletesController, 'create'])
				router.get('/', [AthletesController, 'listWithCache'])
				router.get('/:id/profile', [
					AthletesController,
					'showAthleteProfileWithInjuryRisk',
				])
				router.get('/:id/biomechanics', [
					AthletesController,
					'analyzeBiomechanicalProfile',
				])
				router.patch('/:id', [AthletesController, 'update'])
				router.delete('/:id', [AthletesController, 'delete'])
			})
			.prefix('/athletes')

		router
			.group(() => {
				router.get('/', [InjuryRecordsController, 'list'])
				router.post('/', [InjuryRecordsController, 'create'])
				router.patch('/:id', [InjuryRecordsController, 'update'])
				router.delete('/:id', [InjuryRecordsController, 'delete'])
			})
			.prefix('/injury-records')

		router
			.group(() => {
				router.get('/', [PhysicalAssessmentsController, 'list'])
				router.post('/', [PhysicalAssessmentsController, 'create'])
				router.get('/athlete/:athleteId', [
					PhysicalAssessmentsController,
					'listByAthlete',
				])
				router.get('/:id', [PhysicalAssessmentsController, 'show'])
				router.patch('/:id', [PhysicalAssessmentsController, 'update'])
				router.delete('/:id', [PhysicalAssessmentsController, 'delete'])
			})
			.prefix('/physical-assessments')

		router
			.group(() => {
				router.post('/', [ExercisesController, 'create'])
				router.get('/', [ExercisesController, 'list'])
				router.get('/category/:category', [
					ExercisesController,
					'listByCategory',
				])
				router.get('/body-region/:region', [
					ExercisesController,
					'listByBodyRegion',
				])
				router.get('/:id', [ExercisesController, 'show'])
				router.patch('/:id', [ExercisesController, 'update'])
				router.delete('/:id', [ExercisesController, 'delete'])
			})
			.prefix('/exercises')

		router
			.group(() => {
				router.post('/', [ExerciseMediaController, 'create'])
				router.delete('/:id', [ExerciseMediaController, 'delete'])
				router.get('/exercise/:exerciseId', [
					ExerciseMediaController,
					'listByExercise',
				])
			})
			.prefix('/exercise-media')

		router
			.group(() => {
				router.post('/', [TreatmentPlansController, 'create'])
				router.get('/', [TreatmentPlansController, 'list'])
				router.get('/athlete/:athleteId', [
					TreatmentPlansController,
					'listByAthlete',
				])
				router.get('/:id', [TreatmentPlansController, 'show'])
				router.patch('/:id', [TreatmentPlansController, 'update'])
				router.delete('/:id', [TreatmentPlansController, 'delete'])
				router.post('/:id/activate', [TreatmentPlansController, 'activate'])
				router.post('/:id/pause', [TreatmentPlansController, 'pause'])
				router.post('/:id/complete', [TreatmentPlansController, 'complete'])
			})
			.prefix('/treatment-plans')

		router
			.group(() => {
				router.post('/', [PrescribedExercisesController, 'create'])
				router.get('/treatment-plan/:treatmentPlanId', [
					PrescribedExercisesController,
					'listByTreatmentPlan',
				])
				router.patch('/:id', [PrescribedExercisesController, 'update'])
				router.delete('/:id', [PrescribedExercisesController, 'delete'])
				router.post('/:id/activate', [
					PrescribedExercisesController,
					'activate',
				])
				router.post('/:id/deactivate', [
					PrescribedExercisesController,
					'deactivate',
				])
			})
			.prefix('/prescribed-exercises')

		router
			.group(() => {
				router.post('/', [ExerciseSessionsController, 'create'])
				router.get('/prescribed-exercise/:prescribedExerciseId', [
					ExerciseSessionsController,
					'listByPrescribedExercise',
				])
				router.get('/athlete/:athleteId', [
					ExerciseSessionsController,
					'listByAthlete',
				])
				router.patch('/:id', [ExerciseSessionsController, 'update'])
			})
			.prefix('/exercise-sessions')

		router
			.group(() => {
				router.post('/', [TreatmentSessionsController, 'create'])
				router.get('/treatment-plan/:treatmentPlanId', [
					TreatmentSessionsController,
					'listByTreatmentPlan',
				])
				router.get('/athlete/:athleteId', [
					TreatmentSessionsController,
					'listByAthlete',
				])
				router.patch('/:id', [TreatmentSessionsController, 'update'])
				router.delete('/:id', [TreatmentSessionsController, 'delete'])
			})
			.prefix('/treatment-sessions')

		router
			.group(() => {
				router.post('/', [PatientEvolutionsController, 'create'])
				router.get('/athlete/:athleteId', [
					PatientEvolutionsController,
					'listByAthlete',
				])
				router.get('/treatment-plan/:treatmentPlanId', [
					PatientEvolutionsController,
					'listByTreatmentPlan',
				])
				router.patch('/:id', [PatientEvolutionsController, 'update'])
				router.delete('/:id', [PatientEvolutionsController, 'delete'])
			})
			.prefix('/patient-evolutions')

		router
			.group(() => {
				router.post('/', [MedicationsController, 'create'])
				router.get('/athlete/:athleteId', [
					MedicationsController,
					'listByAthlete',
				])
				router.patch('/:id', [MedicationsController, 'update'])
				router.delete('/:id', [MedicationsController, 'delete'])
				router.post('/:id/activate', [MedicationsController, 'activate'])
				router.post('/:id/deactivate', [MedicationsController, 'deactivate'])
			})
			.prefix('/medications')

		router
			.group(() => {
				router.post('/', [QuestionnairesController, 'create'])
				router.get('/', [QuestionnairesController, 'list'])
				router.get('/type/:type', [QuestionnairesController, 'listByType'])
				router.get('/:id', [QuestionnairesController, 'show'])
				router.patch('/:id', [QuestionnairesController, 'update'])
				router.delete('/:id', [QuestionnairesController, 'delete'])
			})
			.prefix('/questionnaires')

		router
			.group(() => {
				router.post('/', [QuestionnaireQuestionsController, 'create'])
				router.get('/questionnaire/:questionnaireId', [
					QuestionnaireQuestionsController,
					'listByQuestionnaire',
				])
				router.patch('/:id', [QuestionnaireQuestionsController, 'update'])
				router.delete('/:id', [QuestionnaireQuestionsController, 'delete'])
				router.post('/reorder', [QuestionnaireQuestionsController, 'reorder'])
			})
			.prefix('/questionnaire-questions')

		router
			.group(() => {
				router.post('/', [QuestionnaireResponsesController, 'create'])
				router.get('/questionnaire/:questionnaireId', [
					QuestionnaireResponsesController,
					'listByQuestionnaire',
				])
				router.get('/athlete/:athleteId', [
					QuestionnaireResponsesController,
					'listByAthlete',
				])
				router.get('/treatment-plan/:treatmentPlanId', [
					QuestionnaireResponsesController,
					'listByTreatmentPlan',
				])
				router.get('/:id', [QuestionnaireResponsesController, 'show'])
			})
			.prefix('/questionnaire-responses')

		router
			.group(() => {
				router.post('/', [AppointmentsController, 'create'])
				router.get('/', [AppointmentsController, 'list'])
				router.get('/month', [AppointmentsController, 'listByMonth'])
				router.get('/athlete/:athleteId', [
					AppointmentsController,
					'listByAthlete',
				])
				router.get('/user/:userId', [AppointmentsController, 'listByUser'])
				router.get('/date-range', [AppointmentsController, 'listByDateRange'])
				router.get('/:id', [AppointmentsController, 'show'])
				router.patch('/:id', [AppointmentsController, 'update'])
				router.delete('/:id', [AppointmentsController, 'delete'])
				router.post('/:id/confirm', [AppointmentsController, 'confirm'])
				router.post('/:id/cancel', [AppointmentsController, 'cancel'])
				router.post('/:id/reschedule', [AppointmentsController, 'reschedule'])
			})
			.prefix('/appointments')

		router
			.group(() => {
				router.post('/', [ReportsController, 'create'])
				router.get('/', [ReportsController, 'list'])
				router.get('/athlete/:athleteId', [ReportsController, 'listByAthlete'])
				router.get('/treatment-plan/:treatmentPlanId', [
					ReportsController,
					'listByTreatmentPlan',
				])
				router.get('/:id', [ReportsController, 'show'])
				router.delete('/:id', [ReportsController, 'delete'])
				router.post('/generate/progress', [
					ReportsController,
					'generateProgress',
				])
				router.post('/generate/assessment', [
					ReportsController,
					'generateAssessment',
				])
			})
			.prefix('/reports')
	})
	.prefix('/api')
	.use(middleware.auth())
