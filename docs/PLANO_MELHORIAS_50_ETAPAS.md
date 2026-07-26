# Plano de Melhorias — 50 Etapas

> Roadmap derivado do [Benchmark GeekHunter](./BENCHMARK_GEEKHUNTER.md).
> Execução **uma etapa por vez**, cada uma com migração + código + verificação.
>
> Legenda de esforço: **P** (≤2h) · **M** (meio dia) · **G** (1-2 dias)
> Prioridade: **P0** crítico · **P1** alto · **P2** médio

---

## Bloco A — Fundação de dados tech (1-8)

### 1. Enums de perfil tech · P0 · P
**Objetivo:** vocabulário controlado antes de qualquer coluna.
**Escopo:** `CREATE TYPE` para `senioridade_nivel` (estagio, junior, pleno, senior, staff, principal, lead), `nivel_idioma` (nenhum, basico, intermediario, avancado, fluente, nativo), `regime_contratacao` (clt, pj, ambos), `modalidade_trabalho` (remoto, hibrido, presencial).
**Aceite:** tipos criados; `supabase--linter` sem novos avisos.

### 2. Colunas tech em `candidatos` · P0 · M
**Escopo:** `senioridade`, `nivel_ingles`, `pretensao_salarial numeric`, `pretensao_moeda text default 'BRL'`, `regime`, `modalidade`, `disponibilidade_dias int`, `aberto_a_oportunidades boolean default true`. Índices B-tree em cada coluna filtrável.
**Aceite:** `types.ts` regenerado; filtros compilam com tipos nativos.

### 3. Tabela `skills` (taxonomia) · P0 · M
**Escopo:** `public.skills` (`nome`, `slug` único, `categoria`, `aliases text[]`) + GRANT `SELECT` a `authenticated`/`anon`, `ALL` a `service_role`, RLS com leitura pública e escrita só admin.
**Aceite:** tabela acessível pela Data API.

### 4. Seed de +400 skills · P1 · M
**Escopo:** seed por categoria (Backend, Frontend, Mobile, Data, DevOps/SRE, Security, QA, Design, Produto, Cloud) com aliases (`node`→`Node.js`, `js`→`JavaScript`).
**Aceite:** `select count(*) from skills` ≥ 400; nenhum slug duplicado.

### 5. Relação `candidato_skills` · P0 · M
**Escopo:** N:N com `nivel` (1-5) e `anos_experiencia`; unique `(candidato_id, skill_id)`; índices nos dois lados; GRANT + RLS herdando o acesso de `candidatos`.
**Aceite:** perfil renderiza skills tipadas em vez de texto livre.

### 6. Backfill a partir do texto livre · P1 · M
**Escopo:** script que casa `candidatos.habilidades`/currículo com `skills.aliases` e popula `candidato_skills`; relatório de não-casados.
**Aceite:** ≥80% dos termos existentes mapeados; log dos órfãos.

### 7. Enriquecimento no parse de currículo · P1 · M
**Escopo:** `parse-resume` passa a extrair senioridade, inglês, pretensão e skills normalizadas, gravando direto nas novas colunas.
**Aceite:** upload de currículo preenche os campos sem digitação manual.

### 8. Formulário de perfil atualizado · P1 · M
**Escopo:** campos novos no cadastro RH e no portal do candidato, com validação Zod e tokens semânticos.
**Aceite:** criar/editar candidato persiste todos os campos; sem cor hardcoded.

---

## Bloco B — Busca e descoberta (9-15)

### 9. Filtros avançados na UI · P0 · M
**Escopo:** `CandidatosSearchFilters.tsx` ganha senioridade, inglês, regime, modalidade, faixa salarial (slider) e multi-skill.
**Aceite:** cada filtro reflete na query; chips removíveis.

### 10. Filtros no servidor · P0 · M
**Escopo:** `useCandidatos.ts` recebe os novos filtros e aplica `eq`/`gte`/`lte`/`in` no Postgres (nunca em memória).
**Aceite:** filtrar 10k registros sem degradar; sem filtro client-side.

### 11. Filtro por skills com `contains` · P1 · M
**Escopo:** subquery em `candidato_skills` com modo E/OU e nível mínimo.
**Aceite:** "React E TypeScript, nível ≥3" retorna o conjunto correto.

### 12. Busca booleana · P1 · G
**Escopo:** parser de `AND`/`OR`/`NOT`/parênteses/aspas convertendo para `tsquery`; input com validação e mensagem de erro amigável.
**Aceite:** `(react OR vue) AND NOT junior` funciona; expressão inválida não quebra a página.

### 13. Full-text search GIN · P1 · M
**Escopo:** coluna `search_vector tsvector` gerada, índice GIN, trigger de atualização, dicionário `portuguese`.
**Aceite:** busca textual <200ms em 50k registros.

### 14. Filtros salvos · P2 · M
**Escopo:** `buscas_salvas` (nome, filtros jsonb, user_id) + GRANT/RLS por `auth.uid()`; UI de salvar/aplicar/excluir.
**Aceite:** filtro salvo reaplica exatamente o mesmo resultado.

### 15. Alertas de novos perfis · P2 · M
**Escopo:** cron diário avalia buscas salvas com alerta ativo e dispara e-mail com novidades.
**Aceite:** perfil novo compatível gera 1 e-mail, sem duplicidade.

---

## Bloco C — Banco de talentos vivo (16-21)

### 16. Score de engajamento · P1 · M
**Escopo:** função que combina recência de login, resposta a convites, atualização de perfil e candidaturas → 0-100 em `candidatos.engajamento_score`.
**Aceite:** score recalculado diariamente e exibido no card.

### 17. Invisibilização de inativos · P1 · M
**Escopo:** perfis sem sinal há N dias (config por empresa) saem do resultado padrão; toggle "incluir inativos".
**Aceite:** busca padrão só mostra perfis vivos; contador de ocultos visível.

### 18. Badge "aberto a oportunidades" · P2 · P
**Escopo:** flag no portal do candidato, com expiração automática e badge no card.
**Aceite:** candidato liga/desliga; filtro respeita a flag.

### 19. Reengajamento em massa · P1 · M
**Escopo:** campanha para inativos via e-mail/WhatsApp com link de atualização de perfil em 1 clique, respeitando LGPD e opt-out.
**Aceite:** campanha registrada, opt-out honrado, métricas de abertura.

### 20. Oxigenação diária (cron) · P2 · P
**Escopo:** job agendado recalcula engajamento, aplica invisibilização e expira badges.
**Aceite:** execução diária logada, idempotente.

### 21. Deduplicação de perfis · P1 · M
**Escopo:** detecção por e-mail/telefone/hash de nome+empresa, tela de merge com escolha de campo vencedor e preservação do histórico.
**Aceite:** merge não perde candidaturas nem comunicações.

---

## Bloco D — Inteligência artificial (22-27)

### 22. Recomendação proativa por vaga · P1 · G
**Escopo:** ao publicar vaga, job assíncrono ranqueia o talent pool e grava `vaga_recomendacoes`; painel "Talentos sugeridos".
**Aceite:** vaga nova exibe top-20 em até 5 minutos.

### 23. Perfis em destaque · P2 · M
**Escopo:** destaque global dos perfis com melhor combinação score×engajamento na listagem.
**Aceite:** seção de destaques com justificativa por perfil.

### 24. Explicabilidade do score · P1 · M
**Escopo:** persistir breakdown (skills 40 / experiência 35 / formação 25 + comportamental) e renderizar "por que este score".
**Aceite:** todo score exibido tem detalhamento auditável.

### 25. Feedback loop · P1 · M
**Escopo:** decisões humanas (avançar/reprovar) alimentam `ia_feedback` para calibrar pesos por empresa.
**Aceite:** feedback gravado e pesos ajustáveis por tenant.

### 26. Cache e controle de custo de IA · P1 · M
**Escopo:** estender o cache existente com hash de (vaga + currículo), TTL, e teto de gasto por empresa com alerta.
**Aceite:** reprocessar a mesma dupla não chama o modelo; teto bloqueia com mensagem clara.

### 27. Guardrails de viés · P0 · M
**Escopo:** remover nome, idade, gênero, foto, endereço e escola do prompt; teste automatizado que falha se um campo sensível vazar.
**Aceite:** teste no CI; prompt auditado.

---

## Bloco E — Atração e distribuição (28-33)

### 28. Google for Jobs (JSON-LD) · P0 · M
**Escopo:** schema `JobPosting` completo nas páginas públicas de vaga (title, description, datePosted, validThrough, hiringOrganization, jobLocation, employmentType, baseSalary).
**Aceite:** Rich Results Test aprova sem erro.

### 29. Sitemap dinâmico de vagas · P1 · M
**Escopo:** `sitemap-vagas.xml` gerado por edge function, referenciado no `robots.txt`, com `lastmod` por vaga.
**Aceite:** sitemap válido, só vagas abertas.

### 30. Feed XML de vagas · P1 · M
**Escopo:** feed padrão (Indeed/agregadores) autenticado por token, com filtro por empresa.
**Aceite:** feed valida no schema do agregador.

### 31. Conector LinkedIn real · P1 · G
**Escopo:** substituir o stub por edge function proxy com OAuth, credenciais em secrets, retry + circuit breaker já existentes.
**Aceite:** publicar vaga retorna ID externo; erro tratado com mensagem acionável.

### 32. Multiposting 1-clique · P1 · G
**Escopo:** UI de seleção de canais, publicação paralela via `jobBoardService.publishToAll`, tabela `vaga_publicacoes` com status por canal e reenvio.
**Aceite:** status por canal visível e reprocessável.

### 33. SEO das páginas de vaga · P1 · M
**Escopo:** title/description dinâmicos, canonical, OG/Twitter, H1 único, alt em imagens, LCP <2.5s.
**Aceite:** Lighthouse SEO ≥95.

---

## Bloco F — Funil e colaboração (34-39)

### 34. Seleção múltipla e ações em lote · P1 · M
**Escopo:** checkbox no Kanban/lista, mover etapa, reprovar com motivo, enviar e-mail e adicionar tag em lote, com RPC atômica e undo.
**Aceite:** 50 candidatos movidos em uma operação; falha parcial não corrompe.

### 35. Portal do gestor com dados reais · P0 · M
**Escopo:** eliminar `hiringManagerMockData.ts`, consumir vagas/candidaturas reais com RLS por gestor.
**Aceite:** nenhum import de mock; gestor só vê suas vagas.

### 36. Aprovação de vaga · P2 · M
**Escopo:** fluxo requisição → aprovação → publicação, com histórico e notificação.
**Aceite:** vaga só publica após aprovação quando o fluxo está ativo.

### 37. Comentários com @menções · P2 · M
**Escopo:** thread por candidatura, menção notifica in-app e por e-mail.
**Aceite:** menção gera notificação para o mencionado.

### 38. Permissões por vaga · P1 · M
**Escopo:** `vaga_membros` (owner, recrutador, gestor, observador) com RLS derivada.
**Aceite:** observador não consegue mover etapa.

### 39. Duplicar vaga · P2 · P
**Escopo:** clonar vaga com pipeline, knockout, interview kits e scorecards, sem candidatos.
**Aceite:** cópia fiel em 1 clique.

---

## Bloco G — Comunicação e agenda (40-43)

### 40. Convites rastreáveis · P0 · M
**Escopo:** `convites` (enviado, visualizado, respondido, aceito, recusado) com pixel/redirect de tracking e página pública de resposta.
**Aceite:** dashboard exibe taxa de resposta e tempo médio reais.

### 41. Automações por etapa · P1 · M
**Escopo:** ligar o workflow engine às transições de pipeline (e-mail de recusa, lembrete de teste, pesquisa pós-processo).
**Aceite:** mover etapa dispara a automação configurada, com log.

### 42. Google Calendar / Outlook reais · P1 · G
**Escopo:** OAuth via edge function, criação de evento com Meet/Teams, leitura de disponibilidade e cancelamento sincronizado.
**Aceite:** entrevista agendada aparece no calendário dos participantes.

### 43. Lembretes multicanal · P2 · M
**Escopo:** estender `interview-reminders` para e-mail + WhatsApp em T-24h e T-1h, com opt-out e DLQ.
**Aceite:** lembretes entregues nas duas janelas, falha vai para DLQ.

---

## Bloco H — Dados e insights (44-47)

### 44. Analytics com dados reais · P0 · G
**Escopo:** substituir os mocks de `AdvancedAnalyticsPage.tsx` (linhas 21-62) por views/RPC agregadas: time-to-hire, cost-per-hire, efetividade por fonte, quality-of-hire, com filtro de período funcional.
**Aceite:** zero mock na página; números batem com consulta manual ao banco.

### 45. Funil real por etapa · P0 · M
**Escopo:** view materializada de conversão e tempo médio por etapa, por vaga e por departamento, com refresh agendado.
**Aceite:** funil reflete o pipeline real; identifica gargalo.

### 46. Salary benchmark interno · P1 · M
**Escopo:** agregação de pretensão por stack × senioridade × região × regime, com mínimo de amostra (n≥5) para anonimato; widget no formulário de vaga.
**Aceite:** faixas p25/p50/p75 exibidas; nunca revela indivíduo.

### 47. Exportação e relatórios agendados · P2 · M
**Escopo:** export CSV/XLSX/PDF do que está em tela + agendamento semanal por e-mail.
**Aceite:** export respeita filtros ativos; agendamento entrega.

---

## Bloco I — Enterprise (48-50)

### 48. Multi-moeda e multi-localização · P2 · G
**Escopo:** `moeda` em vagas/propostas/pretensão, tabela de câmbio com atualização diária, formatação por locale, i18n pt-BR/en/es.
**Aceite:** vaga em USD exibe conversão indicativa; UI traduzida.

### 49. API pública v1 + webhooks · P2 · G
**Escopo:** `/api/v1` (vagas, candidatos, candidaturas) com API key por tenant, rate limit, versionamento, `openapi.yaml` atualizado; webhooks assinados (HMAC) com retry e log de entrega.
**Aceite:** chave inválida = 401; webhook reentregue após falha.

### 50. D&I e currículo anonimizado · P1 · M
**Escopo:** modo blind screening (oculta nome, foto, idade, gênero, escola) até a etapa configurada; relatório agregado de diversidade sem identificação individual.
**Aceite:** modo cego ativo esconde os campos em todas as telas do funil.

---

## Sequência recomendada

```text
Onda 1 (fundação)   → 1, 2, 3, 5, 27, 35, 44
Onda 2 (busca)      → 4, 6, 7, 8, 9, 10, 11, 45
Onda 3 (atração)    → 28, 29, 33, 40, 34
Onda 4 (inteligência) → 12, 13, 16, 17, 22, 24, 46
Onda 5 (integrações) → 31, 32, 42, 41, 43
Onda 6 (enterprise) → 14, 15, 18-21, 23, 25, 26, 30, 36-39, 47, 48, 49, 50
```

**Dependências duras:** Bloco B depende de 2 e 5 · 46 depende de 2 · 22 depende de 5 · 32 depende de 31 · 45 depende de 40 para conversão completa.

**Credenciais necessárias no momento da execução:** LinkedIn (31/32), Indeed/Catho/InfoJobs (32), Google Calendar e Microsoft Graph (42), Slack/Teams (43). Serão solicitadas via secrets, nunca hardcoded.
