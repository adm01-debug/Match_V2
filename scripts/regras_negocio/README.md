# regras_negocio — regras de negócio para agentes de IA

Produtor da fonte **regras de negócio** do contexto para agentes. Lê código, migrations/`types.ts` e
`docs/contexto/regras/manual/` (texto humano) e publica, na branch derivada `contexto`:

| Arquivo | Conteúdo |
|---|---|
| `docs/contexto/regras/07-REGRAS-DE-NEGOCIO.md` | regras manuais · RLS por operação · constraints/CHECK/FK/colunas calculadas · triggers + `RAISE EXCEPTION` · máquinas de estado (colunas de status, mapas de transição, valores usados no código) · validações (Zod + refine, react-hook-form, inputs) · fórmulas · parâmetros e prazos · mensagens de erro · testes como especificação · eventos de webhook · efeitos colaterais |
| `docs/contexto/regras/10-ACESSO-E-SEGURANCA.md` | perfis, matriz tabela × operação → quem pode, onde o RLS é ignorado (service_role, SECURITY DEFINER), edge functions públicas, rotas protegidas, multi-tenancy, soft delete, PII, colunas de dinheiro |
| `docs/contexto/regras/11-GLOSSARIO-E-LACUNAS.md` | glossário, seed, inconsistências código × schema (NÃO VERIFICADO) e lacunas que só o dono do negócio responde |
| `docs/contexto/regras/manifest.json` | `gerado_em`, `commit`, `entrada`, `arquivos` — lido pelo `indice.py` |
| `docs/contexto/00-INDEX.md` | índice único das fontes, gerado por `indice.py` |

O que **não** é daqui (cada fato tem um dono): rotas/módulos/hooks/edges/grafo → `docs/contexto/codigo/`
(`scripts/ai-context/gerar.mjs`); schema e estado **real** do banco → `inventario/estado/banco.json`
(`scripts/inventario/gerar-banco.mjs`, workflow `inventario-estado-semanal.yml`). As duas primeiras ficam
na branch `contexto`, job a job em `.github/workflows/contexto.yml`.

## Arquivos

- `generate.py` — gerador (stdlib, ~0,3 s). `--profile regras` escreve só 07/10/11; `--schema-snapshot` faz o 06 apontar para um snapshot em vez de reconstruir (não usado aqui: este repo não tem snapshot do banco em arquivo).
- `indice.py` — monta `00-INDEX.md` lendo o `manifest.json` de cada fonte (`--fonte "NOME=CAMINHO[@BRANCH]"`); fonte que vive em outra branch entra como "como ler" (git show / raw), sem inventar conteúdo.
- `publish.sh` — publicação genérica (push / PR / branch derivada) para uso standalone em outros repos; **neste repo não é usado**: o job `publicar` do `contexto.yml` monta a branch `contexto` e o índice.

O índice distingue `ok`, `parcial` (falha de coleta ou reaproveitamento), `não verificável`
(manifest/relatório ilegível), `desatualizado` e fonte ausente.

## Regras humanas

`docs/contexto/regras/manual/*.md` (exceto README e TEMPLATE) entram na seção A do 07 com prioridade
máxima e nunca são sobrescritos. Comece copiando `TEMPLATE-regras-de-negocio.md` para `regras.md`.
Editar `manual/` em main dispara o workflow.

## Rodar local

```bash
python3 scripts/regras_negocio/generate.py --repo . --out docs/contexto/regras --profile regras --no-pointer
```

```bash
python3 scripts/regras_negocio/indice.py --repo . --out docs/contexto/00-INDEX.md \
  --fonte "código=docs/contexto/codigo" --fonte "regras de negócio=docs/contexto/regras"
```

Ler o resultado: `git fetch origin contexto && git show origin/contexto:docs/contexto/00-INDEX.md`.

## Testes

```bash
python3 scripts/regras_negocio/test_generate.py -v
```

A suíte usa fixtures locais e cobre SQL ativo versus histórico, objetos do schema, fontes
Prisma/tipos e a saída do perfil `regras`. Nenhum teste acessa banco ou API de LLM.

**Origem:** portado do `Zapp_Web_V2` (`scripts/regras_negocio/`, produtor `ai-context-sync`), mantido
byte-idêntico ao upstream (por isso em `.prettierignore`).
