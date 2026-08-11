# Benchmark GeekHunter → People Lovers

> Análise competitiva exaustiva em 20 etapas.
> Data: 2026-07-26 · Autor: Engenharia People Lovers
> Documento complementar: [Plano de Melhorias em 50 Etapas](./PLANO_MELHORIAS_50_ETAPAS.md)

---

## Etapa 1 — Metodologia e fontes

Pesquisa primária no site oficial (PT-BR e versão global), páginas de produto e planos, central de ajuda, além de fontes terceiras de reputação.

| Fonte | Uso |
|---|---|
| geekhunter.com.br (home, /empresas) | Posicionamento e prova social |
| /empresas-base-de-talentos | Banco de talentos, skills, filtros |
| /empresas-triagem-por-ia | Triagem por IA e argumentos de valor |
| geekhunter.com/pt/empresas/plataforma-de-recrutamento-tech | Feature list do ATS |
| geekhunter.com/pt/empresas/os-nossos-planos | Matriz Lite / Standard / Premium |
| geekhunter.com/pt/tech-recruiter-as-a-service | Modelo TRaaS |
| suporte.geekhunter.com.br | Comportamento real do produto |
| G2 (reviews e pricing) | Percepção de clientes |
| Reclame Aqui | Atrito com candidatos |
| LinkedIn corporativo / blog | Conteúdo de benchmark salarial |

Cada afirmação sobre o nosso sistema foi verificada diretamente no código (arquivo e/ou tabela citados).

---

## Etapa 2 — Posicionamento e modelo de negócio

- Empresa brasileira (Florianópolis, 2015), ~30 pessoas, posicionada como **all-in-one**: ATS + banco de talentos próprio + serviço humano de recrutamento.
- Monetização por **assinatura SaaS** em três faixas — Lite (2 usuários, 10 vagas/ano), Standard (4 usuários, 30 vagas/ano), Premium (ilimitado + IA). Preços não publicados: "fale com vendas".
- Camada de serviço **TRaaS (Tech Recruiter as a Service)**: recrutador dedicado, mínimo de 5 perfis qualificados por vaga.
- Operação internacional (marca Howdy) com modelo nearshore/EOR, cobrança semanal e sem custo upfront.

**Leitura para nós:** o valor não está apenas no software — está no *ativo de dados* (base curada) e na *garantia de entrega*. Nosso diferencial deve ser profundidade comportamental + IA, não volume de base.

---

## Etapa 3 — Arquitetura funcional do produto

Cinco blocos: (a) atração/divulgação, (b) base de talentos, (c) triagem e IA, (d) funil/ATS, (e) dados e integrações. Tudo converge para uma métrica-âncora divulgada: **14 dias de time-to-hire** contra 33 dias de "padrão de mercado".

Nossa arquitetura cobre (a), (c), (d) com qualidade; (b) e (e) são os pontos frágeis.

---

## Etapa 4 — ATS e pipeline

GeekHunter oferece pipeline personalizável, ações em lote (mover, declinar, e-mailar em 1 clique), duplicação de vagas, scorecards, permissões por função, histórico e busca completa de vagas.

Nós temos pipeline Kanban com 12 etapas, scorecards (`useScorecard.ts`), permissões via `PermissionContext` e RBAC.
**Gap:** ações em lote no funil e duplicação de vaga não foram localizadas no código.

---

## Etapa 5 — Banco de talentos curado (+400 skills)

Base própria e exclusiva, com centenas de milhares de perfis avaliados e mais de 400 habilidades técnicas mapeadas, cobrindo Dev, Data, DevOps/Infra/Security, QA, Design, Produto — e agora também não-tech (Comercial, Marketing, Financeiro, RH).

Nós temos `useTalentPool.ts` com busca fuzzy, mas **sem taxonomia normalizada de skills** e sem cobertura declarada de senioridade/stack.

---

## Etapa 6 — Curadoria e invisibilização de inativos

O cadastro de candidato passa por aprovação — perfis fora dos critérios mínimos são recusados (confirmado por reclamação pública respondida pela empresa). Perfis são mantidos "abertos a novas oportunidades", o que sustenta a taxa de resposta anunciada.

Nós não temos regra de inatividade: um perfil de 3 anos atrás aparece igual a um de ontem. Isso corrói confiança no talent pool.

---

## Etapa 7 — Filtros e busca booleana

Filtros por stack, senioridade, idioma, modalidade, regime PJ/CLT, localização, pretensão salarial; busca booleana e filtros avançados nos planos superiores; dados de contato liberados.

Nosso `CandidatosSearchFilters.tsx` + `useCandidatos.ts` filtram apenas por status, origem, texto livre (`nome`/`email`) e data. A tabela `candidatos` **não possui** `senioridade`, `nivel_ingles`, `pretensao_salarial`, `regime`, `stack`. Este é o gap número um.

---

## Etapa 8 — Triagem por IA e recomendações

IA analisa currículos, destaca perfis e emite recomendações automáticas por vaga; discurso de redução de viés, velocidade e aprendizado contínuo.

Aqui **estamos à frente**: `supabase/functions/match-score`, `ai-screening`, `behavioral-analysis`, `cultural-fit`, `generate-scorecard` e `useRankingVaga.ts` já rodam com Gemini via AI Gateway, com cache e DLQ.
**Gap:** falta a recomendação *proativa* (push de perfis para a vaga) e a explicabilidade formal do score.

---

## Etapa 9 — Convites e engajamento (82% / 48h)

InMails ilimitados em todos os planos; 82% de taxa de resposta; resposta média em 48h. Isso só existe porque é **medido**.

Nós enviamos comunicações (`HistoricoComunicacoes.tsx`, `send-email`, `send-whatsapp`) mas não modelamos "convite" como entidade com estado (enviado / visto / respondido / aceito), logo não temos taxa de resposta.

---

## Etapa 10 — Multiposting e Google for Jobs

Publicação simultânea em múltiplos portais com 1 clique, job board próprio, LinkedIn Jobs e Google for Jobs.

Nossos `linkedinService.ts`, `indeedService.ts`, `cathoService.ts`, `infojobsService.ts` e `vagasService.ts` são **stubs** que retornam falha; `jobBoardService.publishToAll` orquestra corretamente, mas sobre conectores vazios. Google for Jobs (JSON-LD `JobPosting`) não existe — é o item de maior ROI/esforço do roadmap.

---

## Etapa 11 — Career page e employer branding

Career page personalizada, casos de sucesso, distribuição multicanal.

**Paridade atingida:** `CarreirasPage.tsx` com `empresa_branding`, tema dinâmico, rotas `/carreiras` e `/carreiras/:slug`, candidatura 1-clique via `public-apply`. Falta apenas SEO estruturado por vaga.

---

## Etapa 12 — Screening questions e scorecards

Perguntas de triagem e scorecards personalizáveis.

**Superamos:** temos knockout questions com validação server-side (`_shared/knockout.ts`), interview kits pontuados (`useInterviewKits.ts`), scorecards gerados por IA e uma bateria comportamental (DISC, Big Five, MBTI, Eneagrama, SJT, cenários imersivos) que a GeekHunter não oferece.

---

## Etapa 13 — Comunicação, automações e chat

Chat integrado, automações para candidatos, integração de e-mail.

Temos e-mail real (Resend + `email_templates`), WhatsApp (Evolution API), workflow editor visual (`@xyflow/react`) e retry queue. **Gap:** automações amarradas às etapas do pipeline e lembretes multicanal padronizados.

---

## Etapa 14 — Integrações (API, calendário, testes técnicos)

API pública, integração com ATS de terceiros, calendário/e-mail e ferramentas de teste técnico.

`googleCalendarService.ts`, `outlookService.ts`, `slackService.ts`, `teamsService.ts` são stubs. Temos `openapi.yaml`, `docs/API_REFERENCE.md` e `webhook-handler`, mas sem API pública versionada com chaves por tenant.

---

## Etapa 15 — Analytics e métricas de funil

Analytics, relatórios e histórico completo nos planos superiores.

`AdvancedAnalyticsPage.tsx` está **100% hardcoded** (linhas 21-62, comentário `// Mock data`): time-to-hire, cost-per-hire, efetividade de fontes, funil de conversão e quality-of-hire são todos fictícios. É o risco reputacional mais alto do produto hoje — um cliente que confere os números perde a confiança.

---

## Etapa 16 — Transparência salarial e insights de mercado

Pretensão salarial visível em todos os planos + conteúdo de compensation benchmarking.

Não temos nem o campo. Com o campo criado (Bloco A), conseguimos gerar benchmark interno por stack × senioridade × região — algo que a GeekHunter monetiza como diferencial.

---

## Etapa 17 — Segurança, permissões, auditoria, multi-moeda

Eles oferecem 2FA/MFA, logs de auditoria, permissões granulares, suporte multi-idioma, multi-moeda e multi-localização.

**Paridade ou superior** em segurança: `user_2fa`, `admin_audit_log`, RLS granular, SECURITY DEFINER endurecido, Sentry, health check e página `/status`.
**Gap:** multi-moeda e multi-localização inexistentes — bloqueia clientes com operação LatAm/EUA.

---

## Etapa 18 — Experiência do candidato

Cadastro gratuito com curadoria, convites, job board público, feedback constante. Sem app mobile nativo identificado.

Nosso portal do candidato tem auth próprio, perfil, vagas, testes e gamificação — mais rico. O atrito deles (perfil recusado sem explicação) é uma oportunidade: **feedback explicável** como diferencial.

---

## Etapa 19 — Reputação

- **G2:** 4.9/5 (11 avaliações), elogio ao vetting, crítica ao alcance geográfico limitado.
- **Reclame Aqui:** sem reputação definida, volume baixíssimo, 100% respondido; queixa típica = perfil recusado.
- **Google/depoimentos:** rapidez e clareza do processo.
- **Capterra:** sem perfil ativo localizado.

Lição: baixo volume de reclamação vem de curadoria + comunicação, não de ausência de problemas.

---

## Etapa 20 — Matriz de gaps

### Já temos (paridade)
Career page com branding · candidatura 1-clique · knockout questions · pipeline Kanban · scorecards · permissões/RBAC · 2FA · auditoria · e-mail e WhatsApp reais · workflow editor · IA de match e screening · portal do candidato.

### Superamos
Assinatura eletrônica de propostas com trilha imutável (MP 2.200-2/2001) · interview kits pontuados · avaliação comportamental multi-framework · gamificação · cultural fit · observabilidade (Sentry, DLQ, health, `/status`) · LGPD/GDPR.

### Falta (priorizado)
| # | Gap | Impacto | Bloco do roadmap |
|---|---|---|---|
| 1 | Campos tech no candidato (senioridade, inglês, pretensão, regime, stack) | Crítico | A |
| 2 | Analytics com dados reais | Crítico | H |
| 3 | Multiposting real + Google for Jobs | Alto | E |
| 4 | Filtros avançados + busca booleana | Alto | B |
| 5 | Métricas de convite/resposta | Alto | G |
| 6 | Oxigenação do talent pool | Alto | C |
| 7 | Recomendação proativa de perfis | Médio | D |
| 8 | Ações em lote e portal do gestor real | Médio | F |
| 9 | Calendário/Slack/Teams reais | Médio | G |
| 10 | Salary benchmark | Médio | H |
| 11 | Multi-moeda / multi-localização | Médio | I |
| 12 | API pública + webhooks por tenant | Médio | I |

Execução detalhada: [PLANO_MELHORIAS_50_ETAPAS.md](./PLANO_MELHORIAS_50_ETAPAS.md).
