/**
 * @fileoverview Política de Privacidade - página pública
 * @module pages/public/PrivacidadePage
 */
export default function PrivacidadePage() {
  return (
    <div className="min-h-screen bg-background text-foreground py-12 px-4">
      <article className="mx-auto max-w-3xl prose prose-neutral dark:prose-invert">
        <h1>Política de Privacidade</h1>
        <p className="text-muted-foreground">Última atualização: {new Date().toLocaleDateString('pt-BR')}</p>
        <p>
          Esta Política descreve como coletamos, usamos e protegemos seus dados pessoais em conformidade
          com a LGPD (Lei nº 13.709/2018).
        </p>
        <h2>1. Dados Coletados</h2>
        <p>Coletamos dados de identificação (nome, e-mail, telefone), dados profissionais (currículo, histórico) e dados de uso da plataforma (logs, IP, dispositivo).</p>
        <h2>2. Finalidade</h2>
        <p>Utilizamos os dados para viabilizar processos seletivos, comunicação, segurança e melhorias do serviço.</p>
        <h2>3. Compartilhamento</h2>
        <p>Dados podem ser compartilhados com empresas contratantes envolvidas no processo seletivo e com provedores de infraestrutura sob acordos de confidencialidade.</p>
        <h2>4. Direitos do Titular</h2>
        <p>Você pode solicitar acesso, correção, portabilidade ou exclusão dos seus dados a qualquer momento.</p>
        <h2>5. Segurança</h2>
        <p>Adotamos medidas técnicas e organizacionais para proteger seus dados contra acesso não autorizado, perda ou alteração.</p>
        <h2>6. Retenção</h2>
        <p>Os dados são mantidos pelo período necessário ao cumprimento das finalidades ou obrigações legais.</p>
        <h2>7. Contato do DPO</h2>
        <p>dpo@peoplelovers.com.br</p>
      </article>
    </div>
  );
}
