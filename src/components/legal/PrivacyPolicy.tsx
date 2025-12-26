import { ScrollArea } from '@/components/ui/scroll-area';

export function PrivacyPolicy() {
  return (
    <ScrollArea className="h-[600px] pr-4">
      <div className="prose prose-sm dark:prose-invert max-w-none">
        <h1>Política de Privacidade - Match ATS</h1>
        <p><strong>Última atualização:</strong> {new Date().toLocaleDateString('pt-BR')}</p>
        
        <h2>1. Introdução</h2>
        <p>
          A Match ATS ("nós", "nosso" ou "Empresa") está comprometida em proteger sua privacidade. 
          Esta Política de Privacidade explica como coletamos, usamos, divulgamos e protegemos suas 
          informações quando você utiliza nosso sistema de gestão de recrutamento.
        </p>

        <h2>2. Dados que Coletamos</h2>
        <h3>2.1 Dados fornecidos por você:</h3>
        <ul>
          <li>Nome completo, e-mail, telefone</li>
          <li>Currículo e histórico profissional</li>
          <li>Informações de formação acadêmica</li>
          <li>Pretensão salarial e disponibilidade</li>
          <li>Foto de perfil (opcional)</li>
        </ul>

        <h3>2.2 Dados coletados automaticamente:</h3>
        <ul>
          <li>Endereço IP e informações do dispositivo</li>
          <li>Dados de navegação e uso do sistema</li>
          <li>Cookies e tecnologias similares</li>
        </ul>

        <h2>3. Como Usamos seus Dados</h2>
        <ul>
          <li>Processar sua candidatura a vagas</li>
          <li>Comunicar sobre oportunidades e status de processos</li>
          <li>Melhorar nossos serviços e experiência do usuário</li>
          <li>Cumprir obrigações legais e regulatórias</li>
          <li>Análises estatísticas e relatórios internos</li>
        </ul>

        <h2>4. Base Legal (LGPD)</h2>
        <p>Processamos seus dados com base em:</p>
        <ul>
          <li><strong>Consentimento:</strong> Para envio de comunicações de marketing</li>
          <li><strong>Execução de contrato:</strong> Para processar candidaturas</li>
          <li><strong>Legítimo interesse:</strong> Para melhorar nossos serviços</li>
          <li><strong>Obrigação legal:</strong> Para cumprir requisitos trabalhistas</li>
        </ul>

        <h2>5. Compartilhamento de Dados</h2>
        <p>Seus dados podem ser compartilhados com:</p>
        <ul>
          <li>Empresas contratantes (para processos seletivos)</li>
          <li>Prestadores de serviços (hospedagem, email)</li>
          <li>Autoridades legais (quando exigido por lei)</li>
        </ul>

        <h2>6. Seus Direitos (LGPD - Art. 18)</h2>
        <p>Você tem direito a:</p>
        <ul>
          <li>Confirmar a existência de tratamento de dados</li>
          <li>Acessar seus dados pessoais</li>
          <li>Corrigir dados incompletos ou desatualizados</li>
          <li>Solicitar anonimização ou bloqueio de dados</li>
          <li>Solicitar a exclusão de dados pessoais</li>
          <li>Revogar consentimento a qualquer momento</li>
          <li>Solicitar portabilidade dos dados</li>
        </ul>

        <h2>7. Retenção de Dados</h2>
        <p>
          Mantemos seus dados pelo período necessário para cumprir as finalidades descritas 
          nesta política, geralmente por até 5 anos após o último contato, ou conforme 
          exigido por lei.
        </p>

        <h2>8. Segurança</h2>
        <p>
          Implementamos medidas técnicas e organizacionais para proteger seus dados, incluindo 
          criptografia, controle de acesso, backups regulares e monitoramento de segurança.
        </p>

        <h2>9. Cookies</h2>
        <p>
          Utilizamos cookies essenciais, de performance e de funcionalidade. Você pode 
          gerenciar suas preferências de cookies a qualquer momento através do banner de cookies.
        </p>

        <h2>10. Contato do DPO</h2>
        <p>
          Para exercer seus direitos ou esclarecer dúvidas sobre privacidade:
        </p>
        <ul>
          <li><strong>E-mail:</strong> dpo@matchats.com.br</li>
          <li><strong>Endereço:</strong> [Endereço da empresa]</li>
        </ul>

        <h2>11. Alterações</h2>
        <p>
          Esta política pode ser atualizada periodicamente. Notificaremos sobre mudanças 
          significativas por e-mail ou através do sistema.
        </p>
      </div>
    </ScrollArea>
  );
}

export default PrivacyPolicy;
