import { Link } from 'react-router-dom'
import { ArrowLeft, Shield, Lock, Eye, FileText, Mail } from 'lucide-react'
import { Button } from '../components/ui/button'

export function PrivacyPage() {
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
					<div className="flex items-center gap-3 mb-2">
						<Shield className="h-8 w-8 text-blue-600" />
						<h1 className="text-4xl font-bold text-gray-900">Política de Privacidade</h1>
					</div>
					<p className="text-sm text-gray-500 mb-8">
						Versão 1.0.0 | Última atualização: 21 de janeiro de 2026
					</p>

					<div className="prose prose-slate max-w-none space-y-6">
						{/* Intro */}
						<section className="bg-blue-50 p-6 rounded-lg border border-blue-200">
							<p className="text-gray-700 leading-relaxed">
								A SportsPerformance está comprometida com a proteção da sua privacidade e dos
								seus dados pessoais. Esta Política de Privacidade explica como coletamos,
								usamos, armazenamos e protegemos suas informações, em conformidade com a{' '}
								<strong>Lei Geral de Proteção de Dados (LGPD - Lei nº 13.709/2018)</strong>.
							</p>
						</section>

						{/* Section 1 */}
						<section>
							<div className="flex items-center gap-2 mb-3">
								<FileText className="h-6 w-6 text-blue-600" />
								<h2 className="text-2xl font-semibold text-gray-900">
									1. Informações que Coletamos
								</h2>
							</div>
							<p className="text-gray-700 leading-relaxed mb-3">
								Coletamos as seguintes categorias de dados pessoais:
							</p>

							<div className="space-y-4">
								<div className="bg-gray-50 p-4 rounded-lg">
									<h3 className="font-semibold text-gray-900 mb-2">
										1.1. Dados de Cadastro (sua conta)
									</h3>
									<ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
										<li>Nome completo</li>
										<li>Endereço de e-mail</li>
										<li>Senha (armazenada de forma criptografada)</li>
										<li>Data e hora de aceitação dos termos</li>
									</ul>
								</div>

								<div className="bg-gray-50 p-4 rounded-lg">
									<h3 className="font-semibold text-gray-900 mb-2">
										1.2. Dados de Saúde dos Atletas (sob sua responsabilidade)
									</h3>
									<ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
										<li>Informações pessoais dos atletas</li>
										<li>Histórico de lesões e diagnósticos</li>
										<li>Planos de tratamento fisioterapêutico</li>
										<li>Avaliações físicas e testes de desempenho</li>
										<li>Exercícios prescritos e sessões realizadas</li>
										<li>Medicações e prescrições</li>
										<li>Questionários e relatórios de evolução</li>
									</ul>
									<p className="text-sm text-amber-700 mt-2 italic">
										<strong>Importante:</strong> Você é o controlador desses dados de saúde nos
										termos da LGPD. A SportsPerformance atua apenas como operadora,
										processando-os conforme suas instruções.
									</p>
								</div>

								<div className="bg-gray-50 p-4 rounded-lg">
									<h3 className="font-semibold text-gray-900 mb-2">1.3. Dados de Uso</h3>
									<ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
										<li>Logs de acesso e interações com a plataforma</li>
										<li>Endereço IP e informações do dispositivo</li>
										<li>Data e hora de utilização</li>
									</ul>
								</div>
							</div>
						</section>

						{/* Section 2 */}
						<section>
							<div className="flex items-center gap-2 mb-3">
								<Eye className="h-6 w-6 text-blue-600" />
								<h2 className="text-2xl font-semibold text-gray-900">
									2. Como Usamos Suas Informações
								</h2>
							</div>
							<p className="text-gray-700 leading-relaxed mb-2">
								Utilizamos seus dados pessoais para as seguintes finalidades:
							</p>
							<ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
								<li>Criar e gerenciar sua conta de usuário</li>
								<li>Fornecer acesso à plataforma e suas funcionalidades</li>
								<li>Armazenar e processar dados de saúde dos atletas sob sua gestão</li>
								<li>Melhorar a experiência do usuário e a qualidade do serviço</li>
								<li>Garantir a segurança e prevenir fraudes</li>
								<li>Cumprir obrigações legais e regulatórias</li>
								<li>Enviar comunicações importantes sobre o serviço</li>
							</ul>
						</section>

						{/* Section 3 */}
						<section>
							<h2 className="text-2xl font-semibold text-gray-900 mb-3">
								3. Compartilhamento de Dados
							</h2>
							<div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
								<p className="text-gray-700 leading-relaxed">
									<strong>NÃO vendemos, alugamos ou compartilhamos seus dados pessoais com
									terceiros para fins de marketing.</strong> Seus dados podem ser compartilhados
									apenas nas seguintes situações:
								</p>
								<ul className="list-disc list-inside text-gray-700 space-y-1 ml-4 mt-2">
									<li>
										Com provedores de serviços essenciais (hospedagem, infraestrutura) sob
										rigorosos contratos de confidencialidade
									</li>
									<li>Quando exigido por lei ou ordem judicial</li>
									<li>Para proteger nossos direitos legais ou a segurança dos usuários</li>
									<li>Com seu consentimento explícito</li>
								</ul>
							</div>
						</section>

						{/* Section 4 */}
						<section>
							<div className="flex items-center gap-2 mb-3">
								<Lock className="h-6 w-6 text-blue-600" />
								<h2 className="text-2xl font-semibold text-gray-900">4. Segurança dos Dados</h2>
							</div>
							<p className="text-gray-700 leading-relaxed mb-2">
								Implementamos medidas técnicas e organizacionais para proteger seus dados:
							</p>
							<ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
								<li>
									<strong>Criptografia:</strong> Senhas são armazenadas com hash seguro (bcrypt)
								</li>
								<li>
									<strong>Comunicação segura:</strong> Transmissão de dados via HTTPS (SSL/TLS)
								</li>
								<li>
									<strong>Controle de acesso:</strong> Autenticação por token e permissões
									granulares
								</li>
								<li>
									<strong>Backups regulares:</strong> Proteção contra perda de dados
								</li>
								<li>
									<strong>Monitoramento:</strong> Detecção de acessos não autorizados
								</li>
							</ul>
							<p className="text-sm text-gray-600 mt-3 italic">
								Apesar de nossos esforços, nenhum sistema é 100% seguro. Você também deve
								proteger suas credenciais e notificar-nos imediatamente sobre qualquer
								suspeita de violação.
							</p>
						</section>

						{/* Section 5 - LGPD Rights */}
						<section className="bg-blue-50 p-6 rounded-lg border-2 border-blue-300">
							<div className="flex items-center gap-2 mb-3">
								<Shield className="h-6 w-6 text-blue-700" />
								<h2 className="text-2xl font-semibold text-gray-900">
									5. Seus Direitos (LGPD - Art. 18)
								</h2>
							</div>
							<p className="text-gray-700 leading-relaxed mb-3">
								Em conformidade com a LGPD, você tem os seguintes direitos sobre seus dados
								pessoais:
							</p>
							<div className="grid md:grid-cols-2 gap-3">
								<div className="bg-white p-3 rounded border border-blue-200">
									<h3 className="font-semibold text-gray-900 text-sm mb-1">
										✓ Confirmação e Acesso
									</h3>
									<p className="text-sm text-gray-600">
										Confirmar se tratamos seus dados e solicitar uma cópia
									</p>
								</div>
								<div className="bg-white p-3 rounded border border-blue-200">
									<h3 className="font-semibold text-gray-900 text-sm mb-1">✓ Correção</h3>
									<p className="text-sm text-gray-600">
										Atualizar dados incompletos, inexatos ou desatualizados
									</p>
								</div>
								<div className="bg-white p-3 rounded border border-blue-200">
									<h3 className="font-semibold text-gray-900 text-sm mb-1">
										✓ Anonimização/Bloqueio/Eliminação
									</h3>
									<p className="text-sm text-gray-600">
										Solicitar remoção de dados desnecessários ou excessivos
									</p>
								</div>
								<div className="bg-white p-3 rounded border border-blue-200">
									<h3 className="font-semibold text-gray-900 text-sm mb-1">✓ Portabilidade</h3>
									<p className="text-sm text-gray-600">
										Receber seus dados em formato estruturado e interoperável
									</p>
								</div>
								<div className="bg-white p-3 rounded border border-blue-200">
									<h3 className="font-semibold text-gray-900 text-sm mb-1">
										✓ Informação sobre Compartilhamento
									</h3>
									<p className="text-sm text-gray-600">
										Saber com quais entidades seus dados foram compartilhados
									</p>
								</div>
								<div className="bg-white p-3 rounded border border-blue-200">
									<h3 className="font-semibold text-gray-900 text-sm mb-1">
										✓ Revogação do Consentimento
									</h3>
									<p className="text-sm text-gray-600">
										Retirar seu consentimento a qualquer momento
									</p>
								</div>
							</div>
							<div className="mt-4 bg-white p-4 rounded border border-blue-300">
								<p className="text-sm text-gray-700">
									<strong>Como exercer seus direitos:</strong> Entre em contato através do
									e-mail{' '}
									<a
										href="mailto:privacidade@sportsperformance.com"
										className="text-blue-600 hover:underline font-medium"
									>
										privacidade@sportsperformance.com
									</a>
									. Responderemos sua solicitação em até 15 dias.
								</p>
							</div>
						</section>

						{/* Section 6 */}
						<section>
							<h2 className="text-2xl font-semibold text-gray-900 mb-3">6. Retenção de Dados</h2>
							<p className="text-gray-700 leading-relaxed">
								Mantemos seus dados pessoais pelo tempo necessário para cumprir as finalidades
								descritas nesta política, exceto quando um período de retenção maior for
								exigido ou permitido por lei. Após o encerramento de sua conta, seus dados
								serão anonimizados ou excluídos de forma segura, respeitando períodos legais de
								retenção quando aplicável.
							</p>
						</section>

						{/* Section 7 */}
						<section>
							<h2 className="text-2xl font-semibold text-gray-900 mb-3">7. Cookies</h2>
							<p className="text-gray-700 leading-relaxed">
								Utilizamos cookies e tecnologias similares para melhorar sua experiência,
								manter sua sessão ativa e analisar o uso da plataforma. Você pode gerenciar as
								preferências de cookies através das configurações do seu navegador.
							</p>
						</section>

						{/* Section 8 */}
						<section>
							<h2 className="text-2xl font-semibold text-gray-900 mb-3">
								8. Alterações nesta Política
							</h2>
							<p className="text-gray-700 leading-relaxed">
								Podemos atualizar esta Política de Privacidade periodicamente. Alterações
								significativas serão comunicadas por e-mail ou através de notificação na
								plataforma. Recomendamos que você revise esta página regularmente para se
								manter informado sobre como protegemos seus dados.
							</p>
						</section>

						{/* Section 9 */}
						<section>
							<h2 className="text-2xl font-semibold text-gray-900 mb-3">
								9. Reclamações à ANPD
							</h2>
							<p className="text-gray-700 leading-relaxed">
								Se você acredita que seus direitos de proteção de dados foram violados, você
								pode registrar uma reclamação junto à Autoridade Nacional de Proteção de Dados
								(ANPD) através do site{' '}
								<a
									href="https://www.gov.br/anpd"
									target="_blank"
									rel="noopener noreferrer"
									className="text-blue-600 hover:underline"
								>
									www.gov.br/anpd
								</a>
								.
							</p>
						</section>

						{/* Contact Section */}
						<section className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border-2 border-blue-200">
							<div className="flex items-center gap-2 mb-3">
								<Mail className="h-6 w-6 text-blue-600" />
								<h2 className="text-2xl font-semibold text-gray-900">
									10. Entre em Contato
								</h2>
							</div>
							<p className="text-gray-700 leading-relaxed mb-3">
								Para dúvidas sobre esta Política de Privacidade, exercer seus direitos de
								titular de dados ou reportar incidentes de segurança:
							</p>
							<div className="bg-white p-4 rounded border border-blue-200 space-y-2">
								<p className="text-gray-700">
									<strong>E-mail de Privacidade:</strong>{' '}
									<a
										href="mailto:privacidade@sportsperformance.com"
										className="text-blue-600 hover:underline font-medium"
									>
										privacidade@sportsperformance.com
									</a>
								</p>
								<p className="text-gray-700">
									<strong>Suporte Geral:</strong>{' '}
									<a
										href="mailto:suporte@sportsperformance.com"
										className="text-blue-600 hover:underline font-medium"
									>
										suporte@sportsperformance.com
									</a>
								</p>
								<p className="text-gray-700">
									<strong>Responsável:</strong> Equipe de Proteção de Dados SportsPerformance
								</p>
							</div>
						</section>
					</div>

					{/* Footer */}
					<div className="mt-12 pt-6 border-t border-gray-200 text-center">
						<p className="text-sm text-gray-500">
							Ao utilizar a plataforma SportsPerformance, você reconhece que leu e compreendeu
							esta Política de Privacidade e concorda com o tratamento de seus dados conforme
							descrito.
						</p>
						<p className="text-xs text-gray-400 mt-2">
							SportsPerformance - Comprometidos com a proteção dos seus dados pessoais
						</p>
					</div>
				</div>
			</div>
		</div>
	)
}
