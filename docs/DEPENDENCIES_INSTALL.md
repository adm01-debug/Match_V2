# 📦 Dependências Pendentes - Match ATS

## Dependências a Instalar

Execute os seguintes comandos para instalar as dependências necessárias:

```bash
# P1-021: ReactFlow para o editor de workflows
npm install reactflow

# P1-022: QR Code para 2FA
npm install qrcode.react

# P1-023: XLSX para export de relatórios
npm install xlsx

# P2-016: React PDF para geração de PDFs
npm install @react-pdf/renderer

# P2-017: Workbox para PWA/Service Workers
npm install workbox-window workbox-webpack-plugin

# P2-018: Chromatic para visual regression tests (dev)
npm install -D @chromatic-com/storybook
```

## Comando único

```bash
npm install reactflow qrcode.react xlsx @react-pdf/renderer workbox-window workbox-webpack-plugin && npm install -D @chromatic-com/storybook
```

## Verificação

Após instalar, verifique no `package.json`:

```json
{
  "dependencies": {
    "reactflow": "^11.x",
    "qrcode.react": "^3.x",
    "xlsx": "^0.18.x",
    "@react-pdf/renderer": "^3.x",
    "workbox-window": "^7.x"
  },
  "devDependencies": {
    "workbox-webpack-plugin": "^7.x",
    "@chromatic-com/storybook": "^1.x"
  }
}
```

## Impacto

| Dependência | Componentes Afetados |
|-------------|---------------------|
| reactflow | WorkflowEditor, WorkflowCanvas |
| qrcode.react | QRCodeGenerator, TwoFactorSetup |
| xlsx | ReportExport, ReportTable |
| @react-pdf/renderer | ReportExport (PDF) |
| workbox-* | PWA Service Worker, OfflineFallback |
| @chromatic-com/storybook | Visual regression tests |
