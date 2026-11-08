// Contrato de scripts/inventario/gerar-rotas.mjs: le src/routes/*.tsx + lazyPages.ts e os imports
// de cada pagina e grava inventario/estado/rotas.json. Saida deterministica (sem data), para o
// --check do CI poder reprovar arquivo desatualizado.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  lerRoute, extrairChamadas, extrairImports, resolverImport, gerarRotas, serializar, lerUrls,
  lerPaginasLazy, arquivosDeRota, GUARDAS,
} from '../inventario/gerar-rotas.mjs';

const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');

/** Repo minimo com o mesmo desenho de rotas do Match_V2. */
function fixture() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'inv-rotas-'));
  const escrever = (rel, texto) => {
    fs.mkdirSync(path.join(dir, path.dirname(rel)), { recursive: true });
    fs.writeFileSync(path.join(dir, rel), texto);
  };
  escrever('src/routes/lazyPages.ts', `import { lazy } from "react";
export const Dashboard = lazy(() => import("@/pages/Dashboard"));
export const AdminPage = lazy(() => import("@/pages/AdminPage"));
export const SemRota = lazy(() => import("@/pages/SemRota"));
export const Fantasma = lazy(() => import("@/pages/NaoExiste"));
`);
  escrever('src/routes/AppRoutes.tsx', `import { Route, Routes } from "react-router-dom";
import { mainRoutes } from "./MainRoutes";
import { Fantasma } from "./lazyPages";
export function AppRoutes() {
  return (
    <Routes>
      <Route path="/fantasma" element={<Fantasma />} />
      <Route path="/antigo" element={<Navigate to="/" replace />} />
      {mainRoutes}
    </Routes>
  );
}
`);
  escrever('src/routes/MainRoutes.tsx', `import { Route } from "react-router-dom";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { Admin2FAGuard } from "@/components/auth/Admin2FAGuard";
import { Dashboard, AdminPage } from "./lazyPages";
const guard = (el, roles) => <ProtectedRoute requiredRoles={roles}>{el}</ProtectedRoute>;
export const mainRoutes = (
  <>
    <Route path="/" element={guard(<Dashboard />)} />
    <Route path="/painel" element={guard(<Dashboard />, ["admin", "rh"])} />
    <Route
      path="/admin"
      element={
        <ProtectedRoute requiredRoles={["admin"]}>
          <Admin2FAGuard>
            <AdminPage />
          </Admin2FAGuard>
        </ProtectedRoute>
      }
    />
    <Route path="/" element={guard(<Dashboard />)} />
  </>
);
`);
  escrever('src/pages/Dashboard.tsx', `import { useVagas } from "@/hooks/useVagas";
import { quebrado } from "./NaoExiste";
export default function Dashboard() { return null; }
`);
  escrever('src/pages/AdminPage.tsx', `import { supabase } from "@/integrations/supabase/client";
const BUCKET = 'curriculos';
export default function AdminPage() {
  supabase.from('vagas').select();
  supabase.storage.from(BUCKET).list();
  supabase.rpc('match_score');
  supabase.functions.invoke('parse-resume');
  return null;
}
`);
  escrever('src/pages/SemRota.tsx', 'export default function SemRota() { return null; }\n');
  escrever('src/hooks/useVagas.ts', "export const useVagas = () => fetch(`${url}/functions/v1/match-score`);\n");
  escrever('src/integrations/supabase/client.ts', 'export const supabase = {};\n');
  return dir;
}

test('lerRoute: path, pagina, guardas e papeis do helper guard() e do ProtectedRoute', () => {
  const helper = lerRoute(' path="/painel" element={guard(<Dashboard />, ["admin", "rh"])} />');
  assert.equal(helper.caminho, '/painel');
  assert.equal(helper.componente, 'Dashboard');
  assert.deepEqual(helper.papeis, ['admin', 'rh']);
  assert.equal(helper.protegida, true);
  assert.deepEqual(helper.guardas, ['ProtectedRoute']);

  const explicito = lerRoute(` path="/admin" element={
    <ProtectedRoute requiredRoles={["admin"]}><Admin2FAGuard><AdminPage /></Admin2FAGuard></ProtectedRoute>
  } />`);
  assert.equal(explicito.componente, 'AdminPage', 'guarda nao e a pagina');
  assert.deepEqual(explicito.guardas, ['ProtectedRoute', 'Admin2FAGuard']);
  assert.deepEqual(explicito.papeis, ['admin']);

  const publica = lerRoute(' path="/auth" element={<AuthPage />} />');
  assert.equal(publica.protegida, false);
  assert.deepEqual(publica.papeis, []);

  assert.equal(lerRoute(' index element={<X />} />'), null, 'sem path nao e URL');
  assert.equal(lerRoute(' path="/antigo" element={<Navigate to="/" replace />} />').redireciona, '/');
  assert.ok(GUARDAS.includes('PortalProtectedRoute'), 'o portal do candidato tem guarda propria');
});

test('extrairChamadas: tabela, bucket por constante, rpc e edge (invoke e URL)', () => {
  const c = extrairChamadas(`const BUCKET = 'curriculos';
    supabase.from('vagas'); supabase.storage.from(BUCKET).list(); supabase.rpc('match_score');
    supabase.functions.invoke('parse-resume'); fetch(\`\${url}/functions/v1/send-email\`);
    fetch(\`\${url}/rest/v1/candidatos\`); fetch(\`\${url}/rest/v1/rpc/outra\`);`);
  assert.deepEqual(c.tabelas.sort(), ['candidatos', 'vagas']);
  assert.deepEqual(c.buckets, ['curriculos'], 'storage.from com constante de modulo resolve');
  assert.deepEqual(c.rpcs.sort(), ['match_score', 'outra']);
  assert.deepEqual(c.edges.sort(), ['parse-resume', 'send-email']);
});

test('resolverImport: alias @/, relativo, extensao implicita e import que nao existe', () => {
  const dir = fixture();
  const de = path.join(dir, 'src/routes/MainRoutes.tsx');
  assert.equal(resolverImport(dir, de, '@/pages/Dashboard'), path.join(dir, 'src/pages/Dashboard.tsx'));
  assert.equal(resolverImport(dir, de, './lazyPages'), path.join(dir, 'src/routes/lazyPages.ts'));
  assert.equal(resolverImport(dir, de, 'react-router-dom'), null, 'pacote externo');
  assert.equal(resolverImport(dir, de, '@/pages/NaoExiste'), undefined, 'local e inexistente');
  fs.rmSync(dir, { recursive: true, force: true });
});

test('extrairImports pega named, default e import() dinamico e ignora `import type`', () => {
  const imps = extrairImports(`import { lazy } from "react";
import type { AppRole } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
const X = lazy(() => import("@/pages/X"));`);
  const especificadores = imps.map((i) => i.especificador);
  assert.ok(especificadores.includes('react') && especificadores.includes('@/pages/X'));
  assert.equal(especificadores.includes('@/contexts/AuthContext'), false, 'tipo nao e dependencia de runtime');
  assert.ok(imps.find((i) => i.especificador === '@/components/auth/ProtectedRoute').nomes.includes('ProtectedRoute'));
});

test('gerarRotas no fixture: rotas, fecho de imports, duplicada, pagina sem rota e import quebrado', () => {
  const dir = fixture();
  const inv = gerarRotas(dir);
  const porCaminho = Object.fromEntries(inv.urls.map((u) => [`${u.caminho}@${u.declarada_em.split('/').pop()}`, u]));

  assert.equal(inv.resumo.urls, 6, '2 em AppRoutes + 4 em MainRoutes');
  assert.equal(inv.resumo.urls_protegidas, 4);
  assert.equal(inv.resumo.paginas_em_lazy, 4);

  const admin = porCaminho['/admin@MainRoutes.tsx'];
  assert.equal(admin.arquivo, 'src/pages/AdminPage.tsx');
  assert.deepEqual(admin.papeis, ['admin']);
  assert.deepEqual(admin.tabelas, ['vagas']);
  assert.deepEqual(admin.buckets, ['curriculos']);
  assert.deepEqual(admin.rpcs, ['match_score']);
  assert.deepEqual(admin.edges, ['parse-resume']);

  const home = porCaminho['/@MainRoutes.tsx'];
  assert.deepEqual(home.hooks, [{ nome: 'useVagas', arquivo: 'src/hooks/useVagas.ts' }]);
  assert.deepEqual(home.edges, ['match-score'], 'edge chamada dentro do hook entra no fecho da pagina');
  assert.deepEqual(inv.hooks.useVagas, { arquivo: 'src/hooks/useVagas.ts', rotas: ['/', '/painel'] });

  const tipos = inv.problemas.reduce((acc, p) => ({ ...acc, [p.tipo]: [...(acc[p.tipo] ?? []), p.id] }), {});
  assert.deepEqual(tipos.rota_sem_arquivo, ['/fantasma'], 'componente lazy apontando para arquivo que nao existe');
  assert.deepEqual(tipos.pagina_sem_rota, ['SemRota']);
  assert.deepEqual(tipos.rota_duplicada, ['/']);
  assert.deepEqual(tipos.import_quebrado, ['/', '/painel'], 'o mesmo import quebrado aparece nas duas rotas da pagina');
  assert.equal(porCaminho['/antigo@AppRoutes.tsx'].redireciona, '/');

  assert.equal(serializar(inv), serializar(gerarRotas(dir)), 'saida deterministica: nenhuma data no arquivo');
  fs.rmSync(dir, { recursive: true, force: true });
});

test('no repo real: todas as rotas resolvem para um arquivo e o inventario commitado esta em dia', () => {
  const arquivos = arquivosDeRota(raiz);
  assert.ok(arquivos.includes('src/routes/AppRoutes.tsx') && arquivos.includes('src/routes/MainRoutes.tsx'));
  const lazy = lerPaginasLazy(raiz);
  assert.ok(Object.keys(lazy.mapa).length > 40, 'lazyPages.ts com as paginas do produto');

  const urls = lerUrls(raiz);
  assert.ok(urls.length > 40, `rotas do produto (achou ${urls.length})`);
  const semArquivo = urls.filter((u) => u.componente && !u.arquivo && !u.redireciona).map((u) => u.caminho);
  assert.deepEqual(semArquivo, [], 'rota apontando para pagina inexistente');
  assert.ok(urls.some((u) => u.guardas.includes('Admin2FAGuard')), 'as rotas de admin passam pelo 2FA');

  const commitado = path.join(raiz, 'inventario/estado/rotas.json');
  if (fs.existsSync(commitado)) {
    assert.equal(fs.readFileSync(commitado, 'utf8'), serializar(gerarRotas(raiz)),
      'inventario/estado/rotas.json desatualizado: rode node scripts/inventario/gerar-rotas.mjs');
  }
});
