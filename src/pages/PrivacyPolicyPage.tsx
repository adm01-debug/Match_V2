import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import Layout from '@/components/layout/Layout';

export default function PrivacyPolicyPage() {
  return (
    <Layout>
      <div className="container max-w-4xl py-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Política de Privacidade</CardTitle>
            <p className="text-sm text-muted-foreground">Última atualização: 26 de dezembro de 2025</p>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[70vh] pr-4">
              <div className="space-y-6 text-sm">
                <section>
                  <h2 className="text-lg font-semibold mb-2">1. Introdução</h2>
                  <p>O Match ATS ("nós", "nosso" ou "nossa") está comprometido em proteger sua privacidade. Esta Política de Privacidade explica como coletamos, usamos, divulgamos e protegemos suas informações pessoais em conformidade com a Lei Geral de Proteção de Dados (LGPD - Lei nº 13.709/2018).</p>
                </section>

                <section>
                  <h2 className="text-lg font-semibold mb-2">2. Dados Coletados</h2>
                  <p>Coletamos os seguintes tipos de dados pessoais:</p>
                  <ul className="list-disc pl-6 mt-2 space-y-1">
                    <li><strong>Dados de identificação:</strong> nome, CPF, RG, data de nascimento</li>
                    <li><strong>Dados de contato:</strong> e-mail, telefone, endereço</li>
                    <li><strong>Dados profissionais:</strong> currículo, experiências, formação acadêmica</li>
                    <li><strong>Dados de uso:</strong> logs de acesso, preferências, interações com a plataforma</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-lg font-semibold mb-2">3. Finalidade do Tratamento</h2>
                  <p>Utilizamos seus dados para:</p>
                  <ul className="list-disc pl-6 mt-2 space-y-1">
                    <li>Gerenciar processos seletivos e candidaturas</li>
                    <li>Comunicar sobre vagas e oportunidades</li>
                    <li>Melhorar nossos serviços e experiência do usuário</li>
                    <li>Cumprir obrigações legais e regulatórias</li>
                    <li>Realizar análises estatísticas anônimas</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-lg font-semibold mb-2">4. Base Legal</h2>
                  <p>O tratamento de dados pessoais é realizado com base em:</p>
                  <ul className="list-disc pl-6 mt-2 space-y-1">
                    <li>Consentimento do titular</li>
                    <li>Execução de contrato</li>
                    <li>Cumprimento de obrigação legal</li>
                    <li>Legítimo interesse do controlador</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-lg font-semibold mb-2">5. Compartilhamento de Dados</h2>
                  <p>Seus dados podem ser compartilhados com:</p>
                  <ul className="list-disc pl-6 mt-2 space-y-1">
                    <li>Empresas contratantes (para processos seletivos)</li>
                    <li>Prestadores de serviços essenciais</li>
                    <li>Autoridades públicas (quando exigido por lei)</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-lg font-semibold mb-2">6. Seus Direitos (LGPD)</h2>
                  <p>Você tem direito a:</p>
                  <ul className="list-disc pl-6 mt-2 space-y-1">
                    <li>Confirmar a existência de tratamento</li>
                    <li>Acessar seus dados</li>
                    <li>Corrigir dados incompletos ou desatualizados</li>
                    <li>Solicitar anonimização, bloqueio ou eliminação</li>
                    <li>Portabilidade dos dados</li>
                    <li>Revogar consentimento</li>
                    <li>Informação sobre compartilhamento</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-lg font-semibold mb-2">7. Retenção de Dados</h2>
                  <p>Mantemos seus dados pelo período necessário para cumprir as finalidades descritas, respeitando prazos legais. Após esse período, os dados são eliminados ou anonimizados.</p>
                </section>

                <section>
                  <h2 className="text-lg font-semibold mb-2">8. Segurança</h2>
                  <p>Adotamos medidas técnicas e organizacionais para proteger seus dados, incluindo criptografia, controle de acesso e monitoramento contínuo.</p>
                </section>

                <section>
                  <h2 className="text-lg font-semibold mb-2">9. Contato do Encarregado (DPO)</h2>
                  <p>Para exercer seus direitos ou esclarecer dúvidas sobre o tratamento de dados:</p>
                  <p className="mt-2"><strong>E-mail:</strong> privacidade@matchats.com.br</p>
                </section>

                <section>
                  <h2 className="text-lg font-semibold mb-2">10. Alterações</h2>
                  <p>Esta política pode ser atualizada periodicamente. Notificaremos sobre mudanças significativas através de e-mail ou aviso na plataforma.</p>
                </section>
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
