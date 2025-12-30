# Guia de Componentes - Match ATS

## Estrutura de Componentes

```
src/components/
├── ui/              # Componentes base (shadcn/ui)
├── common/          # Componentes reutilizáveis
├── auth/            # Autenticação e 2FA
├── candidato/       # Gestão de candidatos
├── vagas/           # Gestão de vagas
├── pipeline/        # Kanban e pipeline
├── reports/         # Relatórios e analytics
├── workflow/        # Editor de workflows
├── admin/           # Administração
└── analytics/       # Dashboards
```

## Componentes Principais

### BulkSelectionBar
Barra de seleção múltipla para listas.
```tsx
<BulkSelectionBar
  selectedCount={5}
  totalCount={100}
  onSelectAll={handleSelectAll}
  onClearSelection={handleClear}
  onAction={handleBulkAction}
  entityType="candidatos"
/>
```

### ReportChart
Wrapper para gráficos Recharts.
```tsx
<ReportChart
  title="Funil de Contratação"
  type="funnel" // bar, line, pie, area, funnel
  data={[{ name: "Triagem", value: 100 }]}
  height={300}
/>
```

### TwoFactorSetup / TwoFactorVerify
Componentes de 2FA.
```tsx
<TwoFactorSetup onComplete={() => {}} />
<TwoFactorVerify onSuccess={() => {}} />
```

### WorkflowEditor
Editor visual de workflows com ReactFlow.
```tsx
<WorkflowEditor
  workflow={workflow}
  onSave={handleSave}
  onTest={handleTest}
/>
```

### MatchScoreCard
Exibe score de compatibilidade candidato-vaga.
```tsx
<MatchScoreCard match={{ score: 85, breakdown: {...}, highlights: [...] }} />
```

## Padrões de Design

1. **Composição**: Prefira composição sobre herança
2. **Props tipadas**: Use interfaces TypeScript
3. **Memoização**: Use memo para componentes pesados
4. **Loading states**: Sempre mostre feedback visual
5. **Error boundaries**: Capture erros graciosamente

## Storybook

Execute para visualizar componentes:
```bash
npm run storybook
```
