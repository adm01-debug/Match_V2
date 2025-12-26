import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import Layout from '@/components/layout/Layout';

export default function TermsPage() {
  return (
    <Layout>
      <div className="container max-w-4xl py-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Termos de Uso</CardTitle>
            <p className="text-sm text-muted-foreground">Última atualização: 26 de dezembro de 2025</p>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[70vh] pr-4">
              <div className="space-y-6 text-sm">
                <section>
                  <h2 className="text-lg font-semibold mb-2">1. Aceitação dos Termos</h2>
                  <p>Ao acessar e utilizar o Match ATS, você concorda com estes Termos de Uso. Se você não concordar com qualquer parte destes termos, não poderá utilizar nossos serviços.</p>
                </section>

                <section>
                  <h2 className="text-lg font-semibold mb-2">2. Descrição do Serviço</h2>
                  <p>O Match ATS é uma plataforma de gestão de recrutamento e seleção que permite às empresas gerenciar processos seletivos, candidatos e entrevistas de forma eficiente.</p>
                </section>

                <section>
                  <h2 className="text-lg font-semibold mb-2">3. Cadastro e Conta</h2>
                  <ul className="list-disc pl-6 mt-2 space-y-1">
                    <li>Você deve fornecer informações precisas e completas ao criar sua conta</li>
                    <li>Você é responsável por manter a confidencialidade de sua senha</li>
                    <li>Você deve notificar imediatamente qualquer uso não autorizado de sua conta</li>
                    <li>Uma pessoa não pode manter mais de uma conta</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-lg font-semibold mb-2">4. Uso Aceitável</h2>
                  <p>Você concorda em não utilizar o serviço para:</p>
                  <ul className="list-disc pl-6 mt-2 space-y-1">
                    <li>Violar qualquer lei ou regulamento aplicável</li>
                    <li>Infringir direitos de propriedade intelectual</li>
                    <li>Transmitir conteúdo ilegal, ofensivo ou prejudicial</li>
                    <li>Coletar dados de outros usuários sem consentimento</li>
                    <li>Interferir no funcionamento normal do serviço</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-lg font-semibold mb-2">5. Propriedade Intelectual</h2>
                  <p>Todo o conteúdo do Match ATS, incluindo software, design, logotipos e textos, é de propriedade exclusiva da empresa e protegido por leis de propriedade intelectual.</p>
                </section>

                <section>
                  <h2 className="text-lg font-semibold mb-2">6. Limitação de Responsabilidade</h2>
                  <p>O Match ATS é fornecido "como está", sem garantias de qualquer tipo. Não nos responsabilizamos por danos indiretos, incidentais ou consequentes decorrentes do uso do serviço.</p>
                </section>

                <section>
                  <h2 className="text-lg font-semibold mb-2">7. Modificações</h2>
                  <p>Reservamo-nos o direito de modificar estes termos a qualquer momento. Alterações significativas serão notificadas aos usuários com antecedência.</p>
                </section>

                <section>
                  <h2 className="text-lg font-semibold mb-2">8. Rescisão</h2>
                  <p>Podemos suspender ou encerrar sua conta a qualquer momento por violação destes termos, sem aviso prévio.</p>
                </section>

                <section>
                  <h2 className="text-lg font-semibold mb-2">9. Lei Aplicável</h2>
                  <p>Estes termos são regidos pelas leis da República Federativa do Brasil. Qualquer disputa será resolvida nos tribunais competentes de São Paulo/SP.</p>
                </section>

                <section>
                  <h2 className="text-lg font-semibold mb-2">10. Contato</h2>
                  <p>Para dúvidas sobre estes termos, entre em contato:</p>
                  <p className="mt-2"><strong>E-mail:</strong> juridico@matchats.com.br</p>
                </section>
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
