/**
 * @fileoverview Termos de Uso - página pública
 * @module pages/public/TermosPage
 */
export default function TermosPage() {
  return (
    <div className="min-h-screen bg-background text-foreground py-12 px-4">
      <article className="mx-auto max-w-3xl prose prose-neutral dark:prose-invert">
        <h1>Termos de Uso</h1>
        <p className="text-muted-foreground">Última atualização: {new Date().toLocaleDateString('pt-BR')}</p>
        <p>
          Bem-vindo(a) ao People Lovers. Ao acessar e utilizar esta plataforma você concorda com os termos
          descritos abaixo. Leia com atenção antes de criar sua conta.
        </p>
        <h2>1. Uso da Plataforma</h2>
        <p>A plataforma destina-se a processos de recrutamento e seleção. É proibido uso para fins ilícitos, ofensivos ou que violem direitos de terceiros.</p>
        <h2>2. Conta e Responsabilidades</h2>
        <p>Você é responsável pela veracidade das informações fornecidas e pela segurança das credenciais de acesso.</p>
        <h2>3. Propriedade Intelectual</h2>
        <p>Todos os direitos sobre o software, marcas e conteúdos são reservados aos respectivos titulares.</p>
        <h2>4. Limitação de Responsabilidade</h2>
        <p>A plataforma é fornecida "no estado em que se encontra", sem garantias expressas ou implícitas.</p>
        <h2>5. Alterações</h2>
        <p>Estes termos podem ser atualizados a qualquer momento. Mudanças relevantes serão comunicadas aos usuários.</p>
        <h2>6. Contato</h2>
        <p>Dúvidas: suporte@peoplelovers.com.br</p>
      </article>
    </div>
  );
}
