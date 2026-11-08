#!/usr/bin/env node
/**
 * Inventario das rotas do front -> inventario/estado/rotas.json (fonte de consulta dos agentes).
 *
 * Le o codigo, nao documentacao:
 *  - URLs:  todos os `src/routes/*.tsx` (AppRoutes monta os fragmentos mainRoutes, adminRoutes,
 *           authRoutes e portalRoutes): path, componente, guardas (ProtectedRoute,
 *           PortalProtectedRoute, Admin2FAGuard, helper `guard(...)`), papeis e <Navigate>.
 *  - Arquivo de cada pagina: `src/routes/lazyPages.ts` (lazy(() => import(...))) e, quando a pagina
 *           nao e lazy, os imports do proprio arquivo de rota.
 *  - Para cada pagina: segue os imports a partir do arquivo da pagina (src/hooks/, src/services/,
 *    src/lib/, src/domain/, src/utils/, src/contexts/ e a propria pasta) e lista hooks, edge
 *    functions invocadas, RPCs, tabelas (.from e /rest/v1) e buckets de storage (storage.from).
 *  - `problemas`: rota sem arquivo, pagina exportada em lazyPages sem rota, rota duplicada e import
 *    local que nao resolve.
 *
 * Uso:
 *   node scripts/inventario/gerar-rotas.mjs           grava inventario/estado/rotas.json
 *   node scripts/inventario/gerar-rotas.mjs --check   exit 1 se o arquivo commitado esta desatualizado
 * Saida deterministica (sem data): o mesmo codigo gera o mesmo arquivo.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const RAIZ_PADRAO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const SAIDA_REL = 'inventario/estado/rotas.json';
const PASTA_ROTAS = 'src/routes';
const LAZY_REL = 'src/routes/lazyPages.ts';
const EXTENSOES = ['.tsx', '.ts', '.jsx', '.js', '/index.tsx', '/index.ts'];
// Componentes que embalam a pagina numa rota: nao sao a pagina.
export const GUARDAS = ['ProtectedRoute', 'PortalProtectedRoute', 'Admin2FAGuard', 'RoleGuard', 'Suspense', 'ErrorBoundary'];
const NAO_PAGINA = new Set([...GUARDAS, 'Route', 'Routes', 'Navigate', 'Fragment', 'Outlet', 'Layout']);

const rel = (raiz, abs) => path.relative(raiz, abs).split(path.sep).join('/');
const unico = (lista) => [...new Set(lista)].sort();

/** Resolve um especificador de import para um arquivo do repo (ou null se externo/inexistente). */
export function resolverImport(raiz, deArquivoAbs, especificador) {
  let base;
  if (especificador.startsWith('@/')) base = path.join(raiz, 'src', especificador.slice(2));
  else if (especificador.startsWith('.')) base = path.resolve(path.dirname(deArquivoAbs), especificador);
  else return null;
  if (fs.existsSync(base) && fs.statSync(base).isFile()) return base;
  for (const ext of EXTENSOES) if (fs.existsSync(base + ext)) return base + ext;
  return undefined; // local, mas nao existe
}

/** Imports de um arquivo: [{ especificador, nomes[] }] (estaticos e import() dinamico). */
export function extrairImports(texto) {
  const out = [];
  for (const m of texto.matchAll(/import\s+(type\s+)?([\s\S]*?)\s+from\s+['"]([^'"]+)['"]/g)) {
    if (m[1]) continue;
    const nomes = [...m[2].matchAll(/\b([A-Za-z_$][\w$]*)\b(?!\s*as\b)/g)].map((x) => x[1])
      .filter((n) => !['type', 'as', 'default'].includes(n));
    out.push({ especificador: m[3], nomes });
  }
  for (const m of texto.matchAll(/(?:import|export)\s*(?:\*\s*from\s*)?['"]([^'"]+)['"]/g)) out.push({ especificador: m[1], nomes: [] });
  for (const m of texto.matchAll(/import\(\s*['"]([^'"]+)['"]\s*\)/g)) out.push({ especificador: m[1], nomes: [] });
  for (const m of texto.matchAll(/export\s+(?:\{[^}]*\}|\*)\s+from\s+['"]([^'"]+)['"]/g)) out.push({ especificador: m[1], nomes: [] });
  return out;
}

/**
 * Mapa nome -> valor dos `const NOME = 'literal'` (ou `export const`) de nivel de modulo no texto.
 * Resolve o caso de identificador passado direto pra `.from`/`storage.from`/`rpc`/`invoke` que e,
 * no mesmo arquivo, uma constante de string. Nao resolve parametro de funcao nem ternario.
 * Coluna zero sozinha nao basta: um `const` dentro de funcao tambem pode estar em coluna zero se o
 * arquivo nao passou pelo Prettier. Por isso conta profundidade de `{`/`}` linha a linha e so
 * aceita o `const` quando a profundidade, ANTES de processar a linha, e zero (nivel de modulo de
 * verdade). Contagem ingenua (nao ignora chave dentro de string) e de proposito: na duvida, prefere
 * nao resolver a resolver errado.
 */
function constantesDeString(texto) {
  const mapa = new Map();
  let profundidade = 0;
  for (const linha of texto.split('\n')) {
    if (profundidade === 0) {
      const m = linha.match(/^(?:export\s+)?const\s+([A-Za-z_][A-Za-z0-9_]*)\s*(?::\s*[^=]+)?=\s*['"`]([A-Za-z0-9_.-]+)['"`]\s*[;,]?\s*$/);
      if (m) mapa.set(m[1], m[2]);
    }
    for (const ch of linha) {
      if (ch === '{') profundidade++;
      else if (ch === '}') profundidade--;
    }
  }
  return mapa;
}

/**
 * Chamadas ao Supabase num texto: tabelas (`.from` do cliente e `/rest/v1/<tabela>`), buckets
 * (`storage.from`), RPCs (`.rpc`) e edges (`functions.invoke`, `invokeEdge`, `/functions/v1/<edge>`).
 */
export function extrairChamadas(texto) {
  const pegar = (re) => [...texto.matchAll(re)].map((m) => m[1]);
  const consts = constantesDeString(texto);
  const tabelas = [];
  const buckets = [];
  for (const m of texto.matchAll(/(\bstorage\s*)?\.from\(\s*['"`]([A-Za-z0-9_-]+)['"`]/g)) (m[1] ? buckets : tabelas).push(m[2]);
  for (const m of texto.matchAll(/(\bstorage\s*)?\.from\(\s*([A-Za-z_][A-Za-z0-9_]*)\s*\)/g)) {
    if (consts.has(m[2])) (m[1] ? buckets : tabelas).push(consts.get(m[2]));
  }
  tabelas.push(...pegar(/\/rest\/v1\/([A-Za-z0-9_]+)/g).filter((t) => t !== 'rpc'));
  return {
    tabelas,
    buckets,
    rpcs: [...pegar(/(?:\.|\b)rpc\(\s*['"`]([A-Za-z0-9_]+)['"`]/g), ...pegar(/\/rest\/v1\/rpc\/([A-Za-z0-9_]+)/g)],
    // `functions.invoke` (inclusive quebrado em linha), o atalho `invokeEdge<T>(...)` e a chamada
    // direta pela URL dentro de string/template.
    edges: [
      ...pegar(/(?:functions\s*\.\s*invoke|\binvokeEdge)(?:<[^>()]*>)?\(\s*['"`]([A-Za-z0-9_-]+)(?:\/[^'"`]*)?['"`]/g),
      ...pegar(/['"`][^'"`\n]*\/functions\/v1\/([A-Za-z0-9_-]+)/g),
    ],
  };
}

const ehTeste = (p) => /(\.test\.|\.spec\.|__tests__|\.stories\.)/.test(p);

/**
 * Fecho de imports a partir do arquivo da pagina. Segue sem limite a pasta da propria pagina,
 * src/hooks/, src/services/, src/lib/, src/domain/, src/utils/, src/contexts/ e src/integrations/
 * (onde vivem os helpers que falam com o Supabase); componentes de feature em src/components/
 * (menos o kit de UI em src/components/ui/) entram ate MAX_SALTOS_FEATURE saltos. Teste fica fora.
 * Import local que nao resolve vira problema.
 */
export const MAX_SALTOS_FEATURE = 2;
export const PASTAS_LIVRES = ['src/hooks', 'src/services', 'src/lib', 'src/domain', 'src/utils', 'src/contexts', 'src/integrations', 'src/config', 'src/constants'];
export function fechoDaPagina(raiz, arquivoPaginaAbs) {
  const pastaPagina = path.dirname(arquivoPaginaAbs);
  const dentro = (abs, rel_) => abs.startsWith(path.join(raiz, rel_) + path.sep);
  const livre = (abs) => abs.startsWith(pastaPagina + path.sep) || PASTAS_LIVRES.some((d) => dentro(abs, d));
  const outraFeature = (abs) => dentro(abs, 'src/components') && !dentro(abs, 'src/components/ui');
  const saltosVistos = new Map(); // arquivo -> menor numero de saltos com que foi visitado
  const hooks = new Map();
  const quebrados = new Set();
  const chamadas = { tabelas: [], buckets: [], rpcs: [], edges: [] };
  const fila = [[arquivoPaginaAbs, 0]];
  while (fila.length) {
    const [atual, saltos] = fila.shift();
    if (saltosVistos.has(atual) && saltosVistos.get(atual) <= saltos) continue;
    const primeiraVez = !saltosVistos.has(atual);
    saltosVistos.set(atual, saltos);
    const texto = fs.readFileSync(atual, 'utf8');
    if (primeiraVez) {
      const c = extrairChamadas(texto);
      for (const k of Object.keys(chamadas)) chamadas[k].push(...c[k]);
    }
    for (const imp of extrairImports(texto)) {
      const alvo = resolverImport(raiz, atual, imp.especificador);
      if (alvo === undefined && !/\.(css|scss|svg|png|jpe?g|webp|gif|json)(\?.*)?$|\?/.test(imp.especificador)) {
        quebrados.add(`${rel(raiz, atual)} -> ${imp.especificador}`);
      }
      if (!alvo || ehTeste(alvo)) continue;
      for (const nome of imp.nomes) if (/^use[A-Z]/.test(nome) && !hooks.has(nome)) hooks.set(nome, rel(raiz, alvo));
      if (livre(alvo)) fila.push([alvo, saltos]);
      else if (outraFeature(alvo) && saltos < MAX_SALTOS_FEATURE) fila.push([alvo, saltos + 1]);
    }
  }
  return {
    arquivos_lidos: saltosVistos.size,
    hooks: [...hooks.entries()].map(([nome, arquivo]) => ({ nome, arquivo })).sort((a, b) => a.nome.localeCompare(b.nome)),
    buckets: unico(chamadas.buckets),
    edges: unico(chamadas.edges),
    rpcs: unico(chamadas.rpcs),
    tabelas: unico(chamadas.tabelas),
    imports_quebrados: [...quebrados].sort(),
  };
}

/** `src/routes/lazyPages.ts`: componente -> especificador do import(). */
export function lerPaginasLazy(raiz) {
  const abs = path.join(raiz, LAZY_REL);
  const texto = fs.readFileSync(abs, 'utf8');
  const mapa = {};
  for (const m of texto.matchAll(/export\s+const\s+(\w+)\s*=\s*[\s\S]*?import\(\s*['"]([^'"]+)['"]\s*\)/g)) {
    if (!(m[1] in mapa)) mapa[m[1]] = m[2];
  }
  return { arquivo: LAZY_REL, abs, mapa };
}

/** Arquivos de rota: todos os .tsx de src/routes/ (menos teste e o proprio lazyPages). */
export function arquivosDeRota(raiz) {
  const dir = path.join(raiz, PASTA_ROTAS);
  return fs.readdirSync(dir)
    .filter((f) => f.endsWith('.tsx') && !ehTeste(f))
    .sort()
    .map((f) => `${PASTA_ROTAS}/${f}`);
}

/**
 * Um `<Route ... />` virou que rota? Recebe o pedaco de texto depois de `<Route` e devolve
 * path, componente da pagina, guardas, papeis e redirecionamento.
 */
export function lerRoute(pedaco) {
  const caminho = (pedaco.match(/path(?:=|:\s*)["']([^"']+)["']/) || [])[1];
  if (!caminho) return null;
  const redireciona = (pedaco.match(/<Navigate\s+to=["']([^"']+)["']/) || [])[1] ?? null;
  const usaGuardHelper = /element=\{\s*guard\(/.test(pedaco);
  const guardas = GUARDAS.filter((g) => pedaco.includes(`<${g}`));
  if (usaGuardHelper && !guardas.includes('ProtectedRoute')) guardas.unshift('ProtectedRoute');
  const componente = [...pedaco.matchAll(/<([A-Z]\w*)/g)].map((m) => m[1])
    .find((n) => !NAO_PAGINA.has(n)) ?? null;
  // `requiredRoles={["admin","rh"]}` do ProtectedRoute ou o 2o argumento do helper `guard(...)`.
  const listaPapeis = (pedaco.match(/requiredRoles=\{\[([^\]]*)\]\}/) || [])[1]
    ?? (pedaco.match(/element=\{\s*guard\([\s\S]*?,\s*\[([^\]]*)\]/) || [])[1]
    ?? '';
  const papeis = listaPapeis.match(/['"]([^'"]+)['"]/g)?.map((s) => s.slice(1, -1)) ?? [];
  return { caminho, componente, guardas, papeis, protegida: guardas.length > 0 || usaGuardHelper, redireciona };
}

/** Todas as rotas declaradas em src/routes/, com o arquivo de cada pagina. */
export function lerUrls(raiz) {
  const lazy = lerPaginasLazy(raiz);
  const urls = [];
  for (const arquivoRel of arquivosDeRota(raiz)) {
    const abs = path.join(raiz, arquivoRel);
    const texto = fs.readFileSync(abs, 'utf8');
    // Imports locais do proprio arquivo de rota: cobre pagina que nao passa pelo lazyPages.
    const importados = {};
    for (const imp of extrairImports(texto)) {
      for (const nome of imp.nomes) if (!(nome in importados)) importados[nome] = imp.especificador;
    }
    for (const pedaco of texto.split(/<Route\b/).slice(1)) {
      const rota = lerRoute(pedaco);
      if (!rota) continue;
      const especificador = rota.componente ? (lazy.mapa[rota.componente] ?? importados[rota.componente]) : null;
      const deArquivo = rota.componente && lazy.mapa[rota.componente] ? lazy.abs : abs;
      const alvo = especificador ? resolverImport(raiz, deArquivo, especificador) : null;
      urls.push({
        caminho: rota.caminho,
        componente: rota.componente,
        arquivo: alvo ? rel(raiz, alvo) : null,
        declarada_em: arquivoRel,
        protegida: rota.protegida,
        guardas: rota.guardas,
        papeis: rota.papeis,
        redireciona: rota.redireciona,
      });
    }
  }
  return urls.sort((a, b) => a.caminho.localeCompare(b.caminho) || a.declarada_em.localeCompare(b.declarada_em));
}

/** Monta o inventario inteiro a partir de uma raiz de repo. */
export function gerarRotas(raiz = RAIZ_PADRAO) {
  const lazy = lerPaginasLazy(raiz);
  const vazio = { arquivos_lidos: 0, hooks: [], buckets: [], edges: [], rpcs: [], tabelas: [], imports_quebrados: [] };
  // O fecho de imports e por ARQUIVO de pagina: a mesma pagina em duas rotas (ex.: /vagas/nova e
  // /vagas/:id/editar) le os imports uma vez.
  const fechoPorArquivo = new Map();
  const urls = lerUrls(raiz).map((u) => {
    if (!u.arquivo) return { ...u, ...vazio };
    if (!fechoPorArquivo.has(u.arquivo)) fechoPorArquivo.set(u.arquivo, fechoDaPagina(raiz, path.join(raiz, u.arquivo)));
    return { ...u, ...fechoPorArquivo.get(u.arquivo) };
  });

  const hooks = {};
  for (const u of urls) for (const h of u.hooks) {
    hooks[h.nome] ??= { arquivo: h.arquivo, rotas: [] };
    hooks[h.nome].rotas.push(u.caminho);
  }

  const componentesUsados = new Set(urls.map((u) => u.componente).filter(Boolean));
  const contagem = urls.reduce((acc, u) => ({ ...acc, [u.caminho]: (acc[u.caminho] ?? 0) + 1 }), {});
  const problemas = [
    ...urls.filter((u) => u.componente && !u.arquivo && !u.redireciona)
      .map((u) => ({ tipo: 'rota_sem_arquivo', id: u.caminho, detalhe: `${u.componente} nao resolve em ${LAZY_REL} nem nos imports de ${u.declarada_em}` })),
    ...Object.keys(lazy.mapa).filter((c) => !componentesUsados.has(c)).sort()
      .map((c) => ({ tipo: 'pagina_sem_rota', id: c, detalhe: `exportada em ${LAZY_REL} (${lazy.mapa[c]}) e nao usada em nenhum <Route>` })),
    ...Object.keys(contagem).filter((c) => contagem[c] > 1).sort()
      .map((c) => ({ tipo: 'rota_duplicada', id: c, detalhe: `${contagem[c]} declaracoes do mesmo path (a primeira do react-router ganha)` })),
    ...urls.flatMap((u) => u.imports_quebrados.map((q) => ({ tipo: 'import_quebrado', id: u.caminho, detalhe: q }))),
  ]
    // Path declarado duas vezes repetiria o mesmo problema: uma linha por problema distinto.
    .filter((p, i, lista) => lista.findIndex((o) => o.tipo === p.tipo && o.id === p.id && o.detalhe === p.detalhe) === i);

  return {
    format_version: 1,
    fonte: `scripts/inventario/gerar-rotas.mjs (le ${PASTA_ROTAS}/*.tsx, ${LAZY_REL} e os imports de cada pagina)`,
    resumo: {
      urls: urls.length,
      urls_protegidas: urls.filter((u) => u.protegida).length,
      paginas_em_lazy: Object.keys(lazy.mapa).length,
      hooks_distintos: Object.keys(hooks).length,
      problemas: problemas.length,
    },
    urls,
    hooks: Object.fromEntries(Object.keys(hooks).sort().map((k) => [k, { arquivo: hooks[k].arquivo, rotas: unico(hooks[k].rotas) }])),
    problemas,
  };
}

export const serializar = (inv) => JSON.stringify(inv, null, 2) + '\n';

function main(argv) {
  const saida = path.join(RAIZ_PADRAO, SAIDA_REL);
  const conteudo = serializar(gerarRotas(RAIZ_PADRAO));
  if (argv.includes('--check')) {
    const atual = fs.existsSync(saida) ? fs.readFileSync(saida, 'utf8') : '';
    if (atual !== conteudo) {
      console.error(`${SAIDA_REL} desatualizado: rode node scripts/inventario/gerar-rotas.mjs e commite o resultado.`);
      process.exit(1);
    }
    console.log(`${SAIDA_REL} em dia.`);
    return;
  }
  fs.mkdirSync(path.dirname(saida), { recursive: true });
  fs.writeFileSync(saida, conteudo);
  const r = JSON.parse(conteudo).resumo;
  console.log(`rotas.json: ${r.urls} URLs (${r.urls_protegidas} protegidas), ${r.paginas_em_lazy} paginas em lazyPages, `
    + `${r.hooks_distintos} hooks, ${r.problemas} problemas.`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) main(process.argv.slice(2));
