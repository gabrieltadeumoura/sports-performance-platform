import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { Button } from '../components/ui/button'

export function TermsPage() {
	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4">
			<div className="max-w-4xl mx-auto">
				{/* Header with back button */}
				<div className="mb-8">
					<Link to="/register">
						<Button variant="ghost" className="mb-4">
							<ArrowLeft className="mr-2 h-4 w-4" />
							Voltar
						</Button>
					</Link>
				</div>

				{/* Content Card */}
				<div className="bg-white rounded-lg shadow-xl p-8 md:p-12">
					<h1 className="text-4xl font-bold text-gray-900 mb-2">Termos de Serviço</h1>
					<p className="text-sm text-gray-500 mb-8">
						Versão 1.0.0 | Última atualização: 21 de janeiro de 2026
					</p>

					<div className="prose prose-slate max-w-none space-y-6">
						{/* Section 1 */}
						<section>
							<h2 className="text-2xl font-semibold text-gray-900 mb-3">
								1. Aceitação dos Termos
							</h2>
							<p className="text-gray-700 leading-relaxed">
								Ao criar uma conta e utilizar a plataforma SportsPerformance, você concorda em
								cumprir e estar vinculado a estes Termos de Serviço. Se você não concorda com
								qualquer parte destes termos, não utilize nossos serviços.
							</p>
						</section>

						{/* Section 2 */}
						<section>
							<h2 className="text-2xl font-semibold text-gray-900 mb-3">
								2. Descrição do Serviço
							</h2>
							<p className="text-gray-700 leading-relaxed mb-2">
								SportsPerformance é uma plataforma digital para profissionais de saúde esportiva
								que oferece:
							</p>
							<ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
								<li>Gestão de informações de saúde de atletas</li>
								<li>Registro e acompanhamento de lesões</li>
								<li>Criação e monitoramento de planos de tratamento fisioterapêutico</li>
								<li>Avaliações físicas e testes de desempenho</li>
								<li>Prescrição e acompanhamento de exercícios</li>
								<li>Controle de medicações</li>
								<li>Agendamento de consultas e sessões</li>
								<li>Geração de relatórios de evolução</li>
							</ul>
						</section>

						{/* Section 3 */}
						<section>
							<h2 className="text-2xl font-semibold text-gray-900 mb-3">
								3. Cadastro e Conta de Usuário
							</h2>
							<p className="text-gray-700 leading-relaxed">
								Você é responsável por manter a confidencialidade de suas credenciais de acesso
								e por todas as atividades realizadas em sua conta. Você concorda em notificar
								imediatamente a plataforma sobre qualquer uso não autorizado de sua conta ou
								qualquer outra violação de segurança.
							</p>
						</section>

						{/* Section 4 */}
						<section>
							<h2 className="text-2xl font-semibold text-gray-900 mb-3">
								4. Responsabilidades do Usuário
							</h2>
							<p className="text-gray-700 leading-relaxed mb-2">Você concorda em:</p>
							<ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
								<li>
									Utilizar a plataforma de forma ética e em conformidade com todas as leis
									aplicáveis
								</li>
								<li>
									Manter a confidencialidade dos dados de saúde dos atletas sob sua
									responsabilidade
								</li>
								<li>Fornecer informações precisas, atualizadas e completas</li>
								<li>
									Respeitar os direitos de privacidade e proteção de dados dos atletas (LGPD)
								</li>
								<li>Não compartilhar sua conta com terceiros não autorizados</li>
								<li>
									Não utilizar a plataforma para fins ilegais, fraudulentos ou prejudiciais
								</li>
							</ul>
						</section>

						{/* Section 5 */}
						<section>
							<h2 className="text-2xl font-semibold text-gray-900 mb-3">
								5. Propriedade Intelectual
							</h2>
							<p className="text-gray-700 leading-relaxed">
								Todo o conteúdo, código, design, marcas e funcionalidades da plataforma são de
								propriedade exclusiva da SportsPerformance. Os dados de saúde inseridos por você
								(informações dos atletas) permanecem sob sua titularidade, sendo você o
								controlador desses dados pessoais nos termos da LGPD.
							</p>
						</section>

						{/* Section 6 */}
						<section>
							<h2 className="text-2xl font-semibold text-gray-900 mb-3">
								6. Privacidade e Proteção de Dados
							</h2>
							<p className="text-gray-700 leading-relaxed">
								O tratamento de dados pessoais pela plataforma é regido por nossa{' '}
								<Link to="/privacy" className="text-blue-600 hover:underline">
									Política de Privacidade
								</Link>
								, que está em conformidade com a Lei Geral de Proteção de Dados (LGPD - Lei nº
								13.709/2018). Recomendamos a leitura atenta deste documento.
							</p>
						</section>

						{/* Section 7 */}
						<section>
							<h2 className="text-2xl font-semibold text-gray-900 mb-3">
								7. Limitação de Responsabilidade
							</h2>
							<p className="text-gray-700 leading-relaxed">
								<strong>IMPORTANTE:</strong> SportsPerformance é uma ferramenta de gestão e
								organização de informações. A plataforma NÃO substitui o julgamento clínico
								profissional, avaliação médica ou fisioterapêutica presencial. Você, como
								profissional de saúde, é o único responsável pelas decisões clínicas,
								diagnósticos, prescrições e tratamentos realizados. A plataforma não se
								responsabiliza por erros de diagnóstico, tratamento inadequado ou danos
								decorrentes do uso das informações registradas no sistema.
							</p>
						</section>

						{/* Section 8 */}
						<section>
							<h2 className="text-2xl font-semibold text-gray-900 mb-3">8. Rescisão de Conta</h2>
							<p className="text-gray-700 leading-relaxed">
								Você pode encerrar sua conta a qualquer momento entrando em contato conosco. A
								plataforma também se reserva o direito de suspender ou encerrar contas que
								violem estes Termos de Serviço, sem aviso prévio.
							</p>
						</section>

						{/* Section 9 */}
						<section>
							<h2 className="text-2xl font-semibold text-gray-900 mb-3">
								9. Lei Aplicável e Jurisdição
							</h2>
							<p className="text-gray-700 leading-relaxed">
								Estes Termos de Serviço são regidos pelas leis da República Federativa do
								Brasil, em especial pela Lei Geral de Proteção de Dados (LGPD - Lei nº
								13.709/2018). Qualquer disputa decorrente do uso da plataforma será resolvida
								nos tribunais brasileiros.
							</p>
						</section>

						{/* Section 10 */}
						<section>
							<h2 className="text-2xl font-semibold text-gray-900 mb-3">
								10. Alterações nos Termos
							</h2>
							<p className="text-gray-700 leading-relaxed">
								Reservamo-nos o direito de modificar estes Termos de Serviço a qualquer
								momento. Alterações significativas serão comunicadas por e-mail ou através de
								notificação na plataforma. O uso continuado da plataforma após as alterações
								constitui aceitação dos novos termos.
							</p>
						</section>

						{/* Contact Section */}
						<section className="bg-gray-50 p-6 rounded-lg border border-gray-200">
							<h2 className="text-2xl font-semibold text-gray-900 mb-3">
								11. Informações de Contato
							</h2>
							<p className="text-gray-700 leading-relaxed mb-2">
								Para dúvidas, sugestões ou questões relacionadas a estes Termos de Serviço,
								entre em contato conosco:
							</p>
							<div className="text-gray-700 space-y-1">
								<p>
									<strong>E-mail:</strong>{' '}
									<a
										href="mailto:suporte@sportsperformance.com"
										className="text-blue-600 hover:underline"
									>
										suporte@sportsperformance.com
									</a>
								</p>
								<p>
									<strong>Responsável:</strong> Equipe SportsPerformance
								</p>
							</div>
						</section>
					</div>

					{/* Footer */}
					<div className="mt-12 pt-6 border-t border-gray-200 text-center">
						<p className="text-sm text-gray-500">
							Ao utilizar a plataforma SportsPerformance, você reconhece que leu, compreendeu e
							concordou com estes Termos de Serviço.
						</p>
					</div>
				</div>
			</div>
		</div>
	)
}
