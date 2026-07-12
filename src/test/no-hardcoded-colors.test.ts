/**
 * Guardrail: falha se qualquer componente .tsx contiver cores hardcoded
 * (hex, rgb, rgba, hsl literal, ou classes tailwind com paleta bruta).
 *
 * Exceções controladas em ALLOWLIST — apenas para casos legítimos:
 * - Cores de marca de terceiros (Google, LinkedIn, Slack, Teams, etc.)
 * - Templates de e-mail (clientes não suportam CSS vars)
 * - Canvas fingerprint (hash estável exige literais)
 * - Libs que exigem arrays de hex (canvas-confetti)
 */
import { describe, it, expect } from "vitest";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const ROOT = join(__dirname, "..");

// Arquivos e diretórios onde cores literais são legítimas.
const ALLOWLIST: RegExp[] = [
  // Dados/config/tipos — cores como valores de dicionário
  /\/data\//,
  /\/types\//,
  /\/config\//,
  /\/domain\/gamification\/constants/,
  /\/hooks\/useGamification\.ts$/,
  // Testes (inclusive este arquivo)
  /\.test\.[tj]sx?$/,
  /\.spec\.[tj]sx?$/,
  /\/__tests__\//,
  /\/test\//,
  // Cores de marca de terceiros
  /\/settings\/(TeamsConnect|SlackConnect|OutlookCalendarConnect|LinkedInConnect|JobBoardConnects)\.tsx$/,
  /\/candidatos\/LinkedInImportDialog\.tsx$/,
  /\/pages\/auth\/LoginPage\.tsx$/, // logo do Google
  // Templates de e-mail (hex obrigatório em MJML/HTML de e-mail)
  /\/hooks\/useComunicacoes\.ts$/,
  // Canvas fingerprint — hash estável
  /\/lib\/deviceFingerprint\.ts$/,
  // Libs de confetti/partículas (arrays de hex são API pública)
  /AchievementNotification\.tsx$/,
  /LevelUpCelebration\.tsx$/,
  /GamificationOnboarding\.tsx$/,
  /SwipeValuesCard\.tsx$/,
  /DNAMatchSwiper\.tsx$/,
  /DeuMatchPage\.tsx$/,
  /useAssessmentEngine\.ts$/,
  /personalityMiniGame\/usePersonalityMiniGame\.ts$/,
  // Cenário DNA imersivo — mapa de radar por pilar (dado, não estilo)
  /\/dna\/ImmersiveScenarioPlayer\.tsx$/,
  // Achievement tiers / gamified engine — cores como dado de tier
  /\/gamification\/achievements\/achievementTypes\.ts$/,
  /\/assessments\/gamified\/engineConfig\.ts$/,
  // Quiz de valores — escala Likert (dado)
  /\/match\/candidateValuesQuiz\/constants\.tsx$/,
  // Confetti/particle arrays (canvas-confetti API)
  /\/match\/MatchSwiper\.tsx$/,
  // Cores de marca de terceiros extras
  /\/settings\/IndeedConnect\.tsx$/,
  // Sombras universais rgba(0,0,0,x) — cor neutra do sistema
  /\/onboarding\/OnboardingTour\.tsx$/,
  /\/gamification\/XPToast\.tsx$/,
  /\/gamification\/StreakDisplay\.tsx$/,
  /\/dashboard\/EntrevistasChart\.tsx$/,
  // White label — cores customizáveis por tenant (default fallback)
  /\/hooks\/useWhiteLabel\.ts$/,
  // Entrevistas: cores para chart passadas como dado (poderiam ser tokens; migradas separadamente)
  /\/hooks\/useEntrevistas\.ts$/,
];

// Paletas Tailwind brutas — sinal de bypass do design system
const RAW_TAILWIND = /\b(bg|text|border|ring|from|to|via|shadow|fill|stroke|divide)-(red|blue|green|yellow|purple|pink|orange|cyan|indigo|violet|rose|amber|emerald|teal|sky|fuchsia|lime|slate|gray|zinc|neutral|stone)-(50|100|200|300|400|500|600|700|800|900|950)(\/\d+)?\b/;

// Hex literal (#abc / #aabbcc / #aabbccdd) — ignora hex em comentários simples
const HEX = /#[0-9a-fA-F]{3,8}\b/;

// rgba()/rgb() literais (permitidos apenas com var() dentro, mas para simplicidade proibimos)
const RGB = /\brgba?\s*\(\s*\d/;

// Arbitrary tailwind: bg-[#xxx], text-[#xxx], border-[rgb(...)]
const ARBITRARY = /\b(bg|text|border|ring|from|to|via|shadow|fill|stroke)-\[(?:#[0-9a-fA-F]{3,8}|rgba?\([^\]]+)\]/;

function walk(dir: string, out: string[] = []): string[] {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const st = statSync(full);
    if (st.isDirectory()) {
      if (entry === "node_modules" || entry.startsWith(".")) continue;
      walk(full, out);
    } else if (/\.(tsx|ts)$/.test(entry)) {
      out.push(full);
    }
  }
  return out;
}

function isAllowed(rel: string): boolean {
  return ALLOWLIST.some((re) => re.test(rel));
}

function stripCommentsAndStrings(src: string): string {
  // Remove block comments e line comments para reduzir falso-positivo
  return src
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/(^|[^:])\/\/[^\n]*/g, "$1");
}

describe("Design System — sem cores hardcoded em componentes", () => {
  const files = walk(ROOT).filter((f) => !isAllowed(relative(ROOT, f)));

  const violations: { file: string; line: number; snippet: string; kind: string }[] = [];

  for (const file of files) {
    const raw = readFileSync(file, "utf8");
    const cleaned = stripCommentsAndStrings(raw);
    const lines = cleaned.split("\n");
    lines.forEach((line, i) => {
      const rel = relative(ROOT, file);
      if (RAW_TAILWIND.test(line)) violations.push({ file: rel, line: i + 1, snippet: line.trim().slice(0, 140), kind: "tailwind-palette" });
      else if (ARBITRARY.test(line)) violations.push({ file: rel, line: i + 1, snippet: line.trim().slice(0, 140), kind: "arbitrary-color" });
      else if (HEX.test(line)) violations.push({ file: rel, line: i + 1, snippet: line.trim().slice(0, 140), kind: "hex-literal" });
      else if (RGB.test(line)) violations.push({ file: rel, line: i + 1, snippet: line.trim().slice(0, 140), kind: "rgb-literal" });
    });
  }

  it("não deve haver cores hardcoded fora da allowlist", () => {
    if (violations.length > 0) {
      const report = violations
        .slice(0, 50)
        .map((v) => `  [${v.kind}] ${v.file}:${v.line}\n    ${v.snippet}`)
        .join("\n");
      const extra = violations.length > 50 ? `\n  ...e mais ${violations.length - 50} ocorrências` : "";
      throw new Error(
        `Encontradas ${violations.length} cores hardcoded em componentes.\n` +
          `Use tokens semânticos (bg-primary, text-foreground, hsl(var(--token))).\n\n` +
          report + extra
      );
    }
    expect(violations).toHaveLength(0);
  });
});
