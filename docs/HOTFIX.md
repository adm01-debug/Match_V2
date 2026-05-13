# Procedimento de Hotfix

Este documento descreve o fluxo para correções emergenciais (hotfixes) que precisam ser aplicadas diretamente em produção sem esperar o ciclo normal de release.

## 1. Identificação
Um hotfix é necessário quando:
- Há um erro crítico (P1/P0) impedindo o uso de funcionalidades core.
- Existe uma vulnerabilidade de segurança ativa.
- Dados estão sendo corrompidos ou perdidos.

## 2. Fluxo de Trabalho (Git)
1. **Branch**: Criar uma branch a partir de `main` (ou da branch de produção atual).
   ```bash
   git checkout main
   git pull origin main
   git checkout -b hotfix/descricao-curta
   ```
2. **Desenvolvimento**: Aplicar APENAS a correção necessária. Evitar refatorações ou outras mudanças não relacionadas.
3. **Testes**: Executar suíte de testes local.
   ```bash
   bun test
   bun type-check
   ```
4. **Pull Request**: Abrir um PR para `main` com o prefixo `fix:` ou `hotfix:`.
5. **Aprovação**: Requer aprovação de pelo menos um Arquiteto ou Lead.
6. **Deploy**: O merge na `main` dispara o deploy automático (Lovable Cloud).

## 3. Checklist Pós-Hotfix
- [ ] Validar correção em produção.
- [ ] Notificar stakeholders.
- [ ] Agendar reunião de Post-Mortem (se aplicável).
- [ ] Garantir que a correção foi propagada para branches de desenvolvimento/staging.
